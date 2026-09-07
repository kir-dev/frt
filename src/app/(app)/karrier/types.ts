import type { Recruitment } from "@/payload-types"

export type CareerGroupData = Recruitment
export type Position = Recruitment["positions"][number]
export type PositionSection = NonNullable<Position["sections"]>[number]

/** A pozíciónál indított jelentkezés tölti ki ezzel az űrlap két mezőjét. */
export type SelectedPosition = {
    groupName: string
    positionName: string
}

/** A CMS beállításaiból kiszámolt jelentkezési mód. */
export type ApplicationConfig = {
    isOpen: boolean
    useBuiltInForm: boolean
    googleFormUrl: string | null
    closedText: string
}
