import { Clock, GraduationCap, Wrench } from "lucide-react"
import type { CareerTexts } from "../translations"
import type { Position } from "../types"

interface PositionHighlightsProps {
    position: Position
    texts: CareerTexts
    isEn: boolean
}

/**
 * A pozíció leírása alatti három kiemelt tudnivaló. Az üresen hagyott mezők
 * kimaradnak; ha egyik sincs kitöltve, a blokk sem jelenik meg.
 */
export default function PositionHighlights({ position, texts, isEn }: PositionHighlightsProps) {
    const { highlights } = position

    const items = [
        {
            icon: GraduationCap,
            label: texts.joining,
            value: isEn ? highlights?.joiningEng : highlights?.joining,
        },
        {
            icon: Clock,
            label: texts.timeCommitment,
            value: isEn ? highlights?.timeCommitmentEng : highlights?.timeCommitment,
        },
        {
            icon: Wrench,
            label: texts.subsystem,
            value: isEn ? highlights?.subsystemEng : highlights?.subsystem,
        },
    ].filter((item) => item.value)

    if (items.length === 0) return null

    return (
        <div className="mt-8 grid grid-cols-1 gap-5 border-t border-frtRed/30 pt-6 sm:grid-cols-3">
            {items.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                    <Icon size={24} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-frtRed" />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{label}</p>
                        <p className="text-sm text-gray-400">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
