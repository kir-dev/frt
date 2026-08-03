"use client"

import type { CareerSetting } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { ChevronDown } from "lucide-react"
import { useId, useState } from "react"
import type { CareerTexts } from "../translations"

type CareerFaqItem = NonNullable<CareerSetting["faqs"]>[number]

interface CareerFaqProps {
    items: CareerFaqItem[]
    isEn: boolean
    texts: CareerTexts
}

function itemKey(item: CareerFaqItem, index: number) {
    return String(item.id ?? index)
}

/** A karrieroldal alján megjelenő, CMS-ből szerkeszthető kérdés-válasz lista. */
export default function CareerFaq({ items, isEn, texts }: CareerFaqProps) {
    const sectionId = useId()
    const visibleItems = items.filter((item) => {
        const question = isEn ? item.questionEng : item.question
        const answer = isEn ? item.answerEng : item.answer
        return Boolean(question?.trim() && answer)
    })
    const [openItemKey, setOpenItemKey] = useState<string | null>(() =>
        visibleItems[0] ? itemKey(visibleItems[0], 0) : null,
    )

    if (visibleItems.length === 0) return null

    return (
        <section aria-labelledby={`${sectionId}-title`} className="mt-20 scroll-mt-32">
            <div className="mb-8 max-w-2xl">
                <h2 id={`${sectionId}-title`} className="text-3xl font-bold text-white sm:text-4xl">
                    {texts.faqTitle}
                </h2>
                <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-red-50/75 sm:text-lg">
                    {texts.faqLead}
                </p>
            </div>

            <div className="overflow-hidden rounded-xl bg-frtcardBG">
                {visibleItems.map((item, index) => {
                    const key = itemKey(item, index)
                    const isOpen = openItemKey === key
                    const question = isEn ? item.questionEng : item.question
                    const answer = isEn ? item.answerEng : item.answer
                    const buttonId = `${sectionId}-question-${index}`
                    const panelId = `${sectionId}-answer-${index}`

                    return (
                        <div key={key} className="border-b border-red-300/15 last:border-b-0">
                            <h3>
                                <button
                                    id={buttonId}
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpenItemKey((current) => current === key ? null : key)}
                                    className="group flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-lg font-bold text-white transition-colors hover:bg-red-950/70 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-frtRed sm:px-7 sm:py-6 sm:text-xl"
                                >
                                    <span>{question}</span>
                                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-red-950 text-red-200 transition-colors group-hover:bg-frtRed group-hover:text-white">
                                        <ChevronDown
                                            size={20}
                                            aria-hidden="true"
                                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </span>
                                </button>
                            </h3>

                            {isOpen && (
                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    className="px-5 pt-3 pb-3 pr-16 sm:px-7 sm:pr-24"
                                >
                                    <div className="rich-text-content max-w-[72ch] leading-relaxed text-red-50/80 [&_a]:text-red-300 [&_li]:text-red-50/80 [&_p]:!text-red-50/80 [&_p:last-child]:!mb-0">
                                        <RichText data={answer} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
