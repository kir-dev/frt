"use client"

import type { CareerTexts } from "../translations"
import type { ApplicationConfig, CareerGroupData } from "../types"
import ApplyButton from "./apply-button"

interface CareerSidebarProps {
    groups: CareerGroupData[]
    isEn: boolean
    texts: CareerTexts
    application: ApplicationConfig
    onSelectGroup: (groupId: number) => void
    onApply: () => void
}

/** Ragadós oldalsáv: csoportlista és a jelentkezés gomb. Csak nagy képernyőn. */
export default function CareerSidebar({
    groups,
    isEn,
    texts,
    application,
    onSelectGroup,
    onApply,
}: CareerSidebarProps) {
    return (
        <div className="sticky top-[200px] hidden self-start lg:block">
            <div className="mb-4 w-64 rounded-lg bg-frtcardBG p-5 backdrop-blur-sm">
                <h3 className="mb-4 text-base font-bold text-red-400">{texts.groups}</h3>
                <nav className="space-y-3">
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            type="button"
                            onClick={() => onSelectGroup(group.id)}
                            className="block w-full text-left transition-colors hover:text-red-400"
                        >
                            {isEn ? group.groupNameEng : group.groupName}
                        </button>
                    ))}
                </nav>
            </div>

            {application.isOpen && (
                <div className="rounded-lg bg-frtcardBG p-5 text-center backdrop-blur-sm">
                    <p className="mb-2 text-sm">{texts.interested}</p>
                    <ApplyButton
                        label={texts.apply}
                        application={application}
                        onApply={onApply}
                        className="w-full px-4 py-2 text-base"
                    />
                </div>
            )}
        </div>
    )
}
