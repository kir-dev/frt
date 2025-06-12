"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold mb-4">Hiba történt</h2>
                <p className="mb-6 text-gray-400">Nem sikerült betölteni a híreket.</p>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                    Próbálja újra
                </Button>
            </div>
        </div>
    )
}
