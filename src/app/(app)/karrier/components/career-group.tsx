"use client"

import { RichText } from "@payloadcms/richtext-lexical/react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { openPositionsLabel, type CareerTexts } from "../translations"
import type { ApplicationConfig, CareerGroupData, SelectedPosition } from "../types"
import CareerPosition from "./career-position"

interface CareerGroupProps {
    group: CareerGroupData
    isOpen: boolean
    openPositionKeys: Set<string>
    isEn: boolean
    texts: CareerTexts
    application: ApplicationConfig
    onToggle: () => void
    onTogglePosition: (key: string) => void
    onApply: (position: SelectedPosition) => void
}

function groupImageUrl(group: CareerGroupData) {
    return typeof group.image === "object" && group.image !== null && group.image.url ? group.image.url : null
}

/** Egy csoport lekattintható sávja és a benne lévő nyitott pozíciók. */
export default function CareerGroup({
    group,
    isOpen,
    openPositionKeys,
    isEn,
    texts,
    application,
    onToggle,
    onTogglePosition,
    onApply,
}: CareerGroupProps) {
    const groupName = isEn ? group.groupNameEng : group.groupName
    const openPositions = group.positions.filter((position) => position.positionOpen)
    const imageUrl = groupImageUrl(group)
    const panelId = `group-panel-${group.id}`

    return (
        <section id={`group-${group.id}`} className="scroll-mt-32">
            <div className="overflow-hidden rounded-lg bg-frtcardBG">
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full flex-col items-stretch gap-0 text-left transition-colors hover:bg-red-950 sm:flex-row sm:items-stretch"
                >
                    {/* Kép nélküli csoportnál nem hagyunk üres helyet — a szöveg tölti ki a sávot.
                        A self-stretch miatt a kép a sáv teljes magasságát kitölti, így hosszabb
                        szövegnél sem csúszik el a függőleges közepére. */}
                    {imageUrl && (
                        <div className="relative h-44 w-full shrink-0 sm:h-auto sm:min-h-40 sm:w-56 sm:self-stretch">
                            <Image
                                src={imageUrl}
                                alt={groupName}
                                fill
                                sizes="(max-width: 640px) 100vw, 224px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="flex flex-1 items-center gap-4 px-5 py-5">
                        <div className="min-w-0 flex-1">
                            <h2 className="mb-2 text-2xl font-bold">{groupName}</h2>
                            {/* A sávban csak rövid, szöveges előnézet fér el. A CMS-ben a leírás
                                beágyazott képet is tartalmazhat — azt itt elrejtjük, különben
                                szétfeszítené a sávot. */}
                            <div className="rich-text-content line-clamp-3 text-sm break-words text-gray-300 [&_img]:hidden">
                                <RichText data={isEn ? group.descriptionEng : group.description} />
                            </div>
                            <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
                                {openPositions.length > 0
                                    ? openPositionsLabel(openPositions.length, isEn)
                                    : texts.noOpenPositionsShort}
                            </p>
                        </div>
                        <ChevronDown
                            size={28}
                            aria-hidden="true"
                            className={`shrink-0 text-frtRed transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </button>

                {isOpen && (
                    <div id={panelId} className="border-t border-frtRed/30 px-5 py-5">
                        {openPositions.length > 0 ? (
                            <ul className="space-y-3">
                                {openPositions.map((position, index) => {
                                    const key = `${group.id}-${position.id ?? index}`
                                    const positionName = isEn ? position.positionNameEng : position.positionName

                                    return (
                                        <CareerPosition
                                            key={key}
                                            position={position}
                                            positionName={positionName}
                                            panelId={`position-panel-${key}`}
                                            isOpen={openPositionKeys.has(key)}
                                            isEn={isEn}
                                            texts={texts}
                                            application={application}
                                            onToggle={() => onTogglePosition(key)}
                                            onApply={() => onApply({ groupName, positionName })}
                                        />
                                    )
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-400">{texts.noOpenPositions}</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
