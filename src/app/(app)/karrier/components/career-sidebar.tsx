"use client"

import { ChevronDown } from "lucide-react"
import { useId, useState } from "react"
import type { CareerTexts } from "../translations"
import type { ApplicationConfig, CareerGroupData } from "../types"
import { scrollIntoViewBelowNavbar } from "../use-career-page"
import ApplyButton from "./apply-button"

interface CareerSidebarProps {
    groups: CareerGroupData[]
    isEn: boolean
    texts: CareerTexts
    application: ApplicationConfig
    onSelectGroup: (groupId: number) => void
    onApply: () => void
    hasFaqs: boolean
}

export default function CareerSidebar({
    groups,
    isEn,
    texts,
    application,
    onSelectGroup,
    onApply,
    hasFaqs,
}: CareerSidebarProps) {
    const [open, setOpen] = useState(false)
    const listId = useId()
    return (
        <aside
            aria-label={isEn ? "On this page" : "Oldalon belüli navigáció"}
            className="sticky top-[104px] hidden max-h-[calc(100dvh-120px)] space-y-4 overflow-y-auto rounded-lg lg:block"
        >
            <div className="rounded-lg bg-frtcardBG">
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={listId}
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg p-5 text-left font-bold text-red-400 focus-visible:outline-2 focus-visible:outline-frtRed"
                >
                    {texts.groups}
                    <ChevronDown
                        size={20}
                        aria-hidden
                        className={`motion-safe:transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>
                <nav
                    id={listId}
                    hidden={!open}
                    aria-label={texts.groups}
                    className="space-y-1 px-3 pb-3"
                >
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                onSelectGroup(group.id)
                            }}
                            className="block w-full rounded px-2 py-2 text-left hover:text-red-400 focus-visible:outline-2 focus-visible:outline-frtRed"
                        >
                            {isEn ? group.groupNameEng : group.groupName}
                        </button>
                    ))}
                </nav>
            </div>
            {hasFaqs && (
                <a
                    href="#gyik"
                    onClick={(event) => {
                        event.preventDefault()
                        scrollIntoViewBelowNavbar(
                            document.getElementById("gyik"),
                        )
                    }}
                    className="block rounded-lg bg-frtcardBG p-5 font-bold hover:text-red-400 focus-visible:outline-2 focus-visible:outline-frtRed"
                >
                    {texts.faqTitle}
                </a>
            )}
            {application.isOpen && (
                <div className="rounded-lg bg-frtcardBG p-5 text-center">
                    <ApplyButton
                        label={texts.apply}
                        application={application}
                        onApply={onApply}
                        className="w-full px-4 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    />
                </div>
            )}
        </aside>
    )
}
