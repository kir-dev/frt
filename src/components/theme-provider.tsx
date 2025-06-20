"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const initialState: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
    toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
                                  children,
                                  defaultTheme = "dark",
                                  storageKey = "ui-theme",
                                  ...props
                              }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem(storageKey) as Theme
        if (stored && (stored === "dark" || stored === "light")) {
            setTheme(stored)
        }
    }, [storageKey])

    useEffect(() => {
        if (!mounted) return

        const root = window.document.documentElement

        // Remove existing theme classes
        root.classList.remove("light", "dark")

        // Add new theme class
        root.classList.add(theme)

        // Store in localStorage
        localStorage.setItem(storageKey, theme)

        // Force a re-render by updating a CSS custom property
        root.style.setProperty("--theme", theme)
    }, [theme, storageKey, mounted])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const value = {
        theme,
        setTheme,
        toggleTheme,
    }

    // Prevent flash of unstyled content
    if (!mounted) {
        return <div className="min-h-screen bg-black text-white">{children}</div>
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
