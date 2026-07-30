import { RichText } from "@payloadcms/richtext-lexical/react"
import type { PositionSection } from "../types"

interface PositionSectionsProps {
    sections: PositionSection[]
    isEn: boolean
}

/**
 * A pozíció leírása szekciókra bontva (pl. Feladatok, Szükséges skillek).
 * A szekció ikonja a CMS-ben a címbe írt emoji, a felsorolás formázását a
 * `.karrier-section-list` osztály adja.
 */
export default function PositionSections({ sections, isEn }: PositionSectionsProps) {
    if (sections.length === 0) return null

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
            {sections.map((section, index) => (
                <section key={section.id ?? index}>
                    {/* word-spacing: a címbe írt emoji után szűk a sima szóköz */}
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-red-400 [word-spacing:0.2em]">
                        {isEn ? section.sectionTitleEng : section.sectionTitle}
                    </h4>
                    <div className="karrier-section-list rich-text-content text-sm">
                        <RichText data={isEn ? section.sectionContentEng : section.sectionContent} />
                    </div>
                </section>
            ))}
        </div>
    )
}
