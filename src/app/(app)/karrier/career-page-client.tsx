"use client"

import type { CareerSetting, Recruitment } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { resolveApplicationConfig } from "./career-config"
import ApplicationForm from "./components/application-form"
import ApplyButton from "./components/apply-button"
import CareerFaq from "./components/career-faq"
import CareerGroup from "./components/career-group"
import CareerSidebar from "./components/career-sidebar"
import { careerTexts, isEnglish } from "./translations"
import { useCareerPage } from "./use-career-page"

interface CareerPageClientProps {
    recruitmentData: Recruitment[]
    careerSettings: CareerSetting | null
    lang: string
}

export default function CareerPageClient({ recruitmentData, careerSettings, lang }: CareerPageClientProps) {
    const isEn = isEnglish(lang)
    const texts = careerTexts(isEn)
    const application = resolveApplicationConfig(careerSettings, isEn, texts.applicationsClosed)
    const intro = isEn ? careerSettings?.introEng : careerSettings?.intro
    const faqs = careerSettings?.faqs ?? []

    const {
        formRef,
        openGroupIds,
        openPositionKeys,
        selectedPosition,
        toggleGroup,
        togglePosition,
        openGroupAndScroll,
        applyForPosition,
        scrollToForm,
    } = useCareerPage()

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto flex flex-col justify-center gap-8 px-4 py-12 lg:flex-row">
                <div className="w-full max-w-4xl">
                    <h1 className="mb-4 text-center text-4xl font-bold">{texts.title}</h1>

                    {intro ? (
                        <div className="rich-text-content mb-12 text-center">
                            <RichText data={intro} />
                        </div>
                    ) : (
                        <p className="mb-12 text-center text-lg text-gray-300">{texts.subtitle}</p>
                    )}

                    <div className="space-y-6">
                        {recruitmentData.map((group) => (
                            <CareerGroup
                                key={group.id}
                                group={group}
                                isOpen={openGroupIds.has(group.id)}
                                openPositionKeys={openPositionKeys}
                                isEn={isEn}
                                texts={texts}
                                application={application}
                                onToggle={() => toggleGroup(group.id)}
                                onTogglePosition={togglePosition}
                                onApply={applyForPosition}
                            />
                        ))}
                    </div>

                    <div ref={formRef} id="jelentkezes" className="mt-16 scroll-mt-32">
                        {!application.isOpen ? (
                            <div className="rounded-lg bg-frtcardBG p-8 text-center">
                                <p className="text-lg">{application.closedText}</p>
                            </div>
                        ) : application.useBuiltInForm ? (
                            <ApplicationForm lang={lang} isEn={isEn} selectedPosition={selectedPosition} />
                        ) : (
                            application.googleFormUrl && (
                                <div className="rounded-lg bg-frtcardBG p-8 text-center">
                                    <p className="mb-4 text-xl">{texts.interested}</p>
                                    <ApplyButton
                                        label={texts.apply}
                                        application={application}
                                        onApply={scrollToForm}
                                        className="px-6 py-3"
                                    />
                                </div>
                            )
                        )}
                    </div>

                    <CareerFaq items={faqs} isEn={isEn} texts={texts} />
                </div>

                <CareerSidebar
                    groups={recruitmentData}
                    isEn={isEn}
                    texts={texts}
                    application={application}
                    onSelectGroup={openGroupAndScroll}
                    onApply={scrollToForm}
                />
            </div>
        </main>
    )
}
