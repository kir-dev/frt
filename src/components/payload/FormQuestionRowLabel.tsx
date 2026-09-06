"use client"

import { useRowLabel } from "@payloadcms/ui"

export function FormQuestionRowLabel() {
    const { data, rowNumber } = useRowLabel<{ label?: string }>()
    return <span>{data?.label || `Kérdés ${(rowNumber ?? 0) + 1}`}</span>
}
