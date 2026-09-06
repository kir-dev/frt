"use client"

import { RichText } from "@payloadcms/richtext-lexical/react"
import { ChevronDown } from "lucide-react"
import type { CareerTexts } from "../translations"
import type { ApplicationConfig, Position } from "../types"
import ApplyButton from "./apply-button"
import PositionHighlights from "./position-highlights"
import PositionSections from "./position-sections"

interface CareerPositionProps {
    position: Position
    positionName: string
    panelId: string
    isOpen: boolean
    isEn: boolean
    texts: CareerTexts
    application: ApplicationConfig
    onToggle: () => void
    onApply: () => void
}

/** Egy nyitott pozíció lenyíló sora a csoport panelén belül. */
export default function CareerPosition({
    position,
    positionName,
    panelId,
    isOpen,
    isEn,
    texts,
    application,
    onToggle,
    onApply,
}: CareerPositionProps) {
    const description = isEn ? position.positionDescriptionEng : position.positionDescription

    return (
        <li className="overflow-hidden rounded-lg bg-career-inset">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-career-hover"
            >
                <span className="font-bold text-career-accent">{positionName}</span>
                <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`shrink-0 text-career-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div id={panelId} className="px-5 pt-2 pb-6">
                    {description && (
                        <div className="rich-text-content mb-6">
                            <RichText data={description} />
                        </div>
                    )}

                    <PositionSections sections={position.sections ?? []} isEn={isEn} />

                    <PositionHighlights position={position} texts={texts} isEn={isEn} />

                    {application.isOpen && (
                        <div className="mt-6">
                            <ApplyButton label={texts.applyForThis} application={application} onApply={onApply} />
                        </div>
                    )}
                </div>
            )}
        </li>
    )
}
