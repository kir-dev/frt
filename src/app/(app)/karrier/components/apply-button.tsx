"use client"

import type { ApplicationConfig } from "../types"

interface ApplyButtonProps {
    label: string
    application: ApplicationConfig
    /** Csak beépített űrlap esetén hívjuk; külső űrlapnál linkként viselkedik. */
    onApply: () => void
    /** Méret és szélesség a használat helye szerint. */
    className?: string
}

const BASE_CLASS = "inline-block rounded-lg bg-frtRed font-bold !text-white transition-colors hover:bg-red-700"

/**
 * A "Jelentkezz" gomb a beállított jelentkezési mód szerint gomb vagy külső
 * link. Külső űrlap módban link hiányában semmit nem rajzolunk.
 */
export default function ApplyButton({ label, application, onApply, className = "px-5 py-2.5" }: ApplyButtonProps) {
    if (application.useBuiltInForm) {
        return (
            <button type="button" onClick={onApply} className={`${BASE_CLASS} ${className}`}>
                {label}
            </button>
        )
    }

    if (!application.googleFormUrl) return null

    return (
        <a
            href={application.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BASE_CLASS} ${className}`}
        >
            {label}
        </a>
    )
}
