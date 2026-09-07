"use client"

import type { CareerSetting, Recruitment } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { resolveFormConfig } from "@/lib/career-form"
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

export default function CareerPageClient({
    recruitmentData,
    careerSettings,
    lang,
}: CareerPageClientProps) {
    const isEn = isEnglish(lang)
    const texts = careerTexts(isEn)
    const application = resolveApplicationConfig(
        careerSettings,
        isEn,
        texts.applicationsClosed,
    )
    const intro = isEn ? careerSettings?.introEng : careerSettings?.intro
    const faqs = careerSettings?.faqs ?? []
    const hasFaqs = faqs.some((item) =>
        Boolean(
            (isEn ? item.questionEng : item.question)?.trim() &&
                (isEn ? item.answerEng : item.answer),
        ),
    )

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
        <div className="career-page min-h-screen">
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <header>
                    <h1 className="mb-4 text-center text-4xl font-bold">
                        {texts.title}
                    </h1>

                    {intro ? (
                        <div className="rich-text-content mb-12 text-center">
                            <RichText data={intro} />
                        </div>
                    ) : (
                        <p className="mb-12 text-center text-lg text-career-muted">
                            {texts.subtitle}
                        </p>
                    )}
                </header>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
                    <div className="min-w-0">
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

                        <CareerFaq items={faqs} isEn={isEn} texts={texts} />

                        <div
                            tabIndex={-1}
                            ref={formRef}
                            id="jelentkezes"
                            className="mt-16 scroll-mt-32"
                        >
                            {!application.isOpen ? (
                                <div className="rounded-lg bg-career-surface ring-1 ring-inset ring-career-border p-8 text-center">
                                    <p className="text-lg">
                                        {application.closedText}
                                    </p>
                                </div>
                            ) : application.useBuiltInForm ? (
                                <ApplicationForm
                                    lang={lang}
                                    isEn={isEn}
                                    selectedPosition={selectedPosition}
                                    initialConfig={resolveFormConfig(
                                        careerSettings,
                                    )}
                                />
                            ) : (
                                application.googleFormUrl && (
                                    <div className="rounded-lg bg-career-surface ring-1 ring-inset ring-career-border p-8 text-center">
                                        <p className="mb-4 text-xl">
                                            {texts.interested}
                                        </p>
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
                    </div>

                    <CareerSidebar
                        groups={recruitmentData}
                        isEn={isEn}
                        texts={texts}
                        application={application}
                        onSelectGroup={openGroupAndScroll}
                        onApply={scrollToForm}
                        hasFaqs={hasFaqs}
                    />
                </div>
            </div>
        </div>
    )
}
