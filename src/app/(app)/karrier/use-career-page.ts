"use client"

import { useCallback, useRef, useState } from "react"
import type { SelectedPosition } from "./types"

const FALLBACK_NAVBAR_HEIGHT = 80
const SCROLL_GAP = 20

export function scrollIntoViewBelowNavbar(element: HTMLElement | null) {
    if (!element) return
    element.focus({ preventScroll: true })

    const navbar = document.querySelector("nav")
    const navbarHeight = navbar ? navbar.offsetHeight : FALLBACK_NAVBAR_HEIGHT
    const top = element.getBoundingClientRect().top + window.scrollY - navbarHeight - SCROLL_GAP

    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
}

function toggleInSet<T>(set: Set<T>, value: T) {
    const next = new Set(set)
    if (!next.delete(value)) next.add(value)
    return next
}

/**
 * A Karrier oldal interakciós állapota: melyik csoportok és pozíciók vannak
 * nyitva, melyik pozícióra indult jelentkezés, és a görgetés az űrlaphoz.
 * Egyszerre tetszőleges számú lenyíló lehet nyitva, ezért halmazokat tárolunk.
 */
export function useCareerPage() {
    const [openGroupIds, setOpenGroupIds] = useState<Set<number>>(new Set())
    const [openPositionKeys, setOpenPositionKeys] = useState<Set<string>>(new Set())
    const [selectedPosition, setSelectedPosition] = useState<SelectedPosition | null>(null)
    const formRef = useRef<HTMLDivElement>(null)

    const toggleGroup = useCallback((groupId: number) => {
        setOpenGroupIds((previous) => toggleInSet(previous, groupId))
    }, [])

    const togglePosition = useCallback((key: string) => {
        setOpenPositionKeys((previous) => toggleInSet(previous, key))
    }, [])

    const scrollToForm = useCallback(() => {
        scrollIntoViewBelowNavbar(formRef.current)
    }, [])

    const openGroupAndScroll = useCallback((groupId: number) => {
        // Az oldalsávból mindig nyitunk (nem váltunk), a többi nyitott csoport marad.
        setOpenGroupIds((previous) => new Set(previous).add(groupId))
        // A megnyitás után egy kirajzolással később görgetünk, hogy a kinyílt
        // tartalom már a helyén legyen.
        requestAnimationFrame(() => scrollIntoViewBelowNavbar(document.getElementById(`group-${groupId}`)))
    }, [])

    const applyForPosition = useCallback((position: SelectedPosition) => {
        setSelectedPosition(position)
        requestAnimationFrame(() => scrollIntoViewBelowNavbar(formRef.current))
    }, [])

    return {
        formRef,
        openGroupIds,
        openPositionKeys,
        selectedPosition,
        toggleGroup,
        togglePosition,
        openGroupAndScroll,
        applyForPosition,
        scrollToForm,
    }
}
