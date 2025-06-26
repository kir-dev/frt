"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={
                `w-10 h-10 flex items-center justify-center font-bold transition-colors outline-none border-0 shadow-none rounded-lg hover:bg-red-400
                ${theme === "dark"
                    ? "!text-white hover:text-white"
                    : "!text-white hover:text-white"}
                `
            }
            style={{ boxShadow: 'none', border: 'none' }}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
    )
}
