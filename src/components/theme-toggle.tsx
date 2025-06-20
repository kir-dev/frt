"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 text-white hover:text-red-500 hover:bg-gray-800 dark:text-white dark:hover:text-red-500 dark:hover:bg-gray-800 light:text-gray-900 light:hover:text-red-500 light:hover:bg-gray-100"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    )
}
