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
        <div className="career-page min-h-screen">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold mb-4">Hiba történt</h2>
                <p className="mb-6 text-career-muted">Nem sikerült betölteni a karrier oldal adatait.</p>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="border-career-accent text-career-accent hover:bg-career-action hover:text-career-on-action"
                >
                    Próbálja újra
                </Button>
            </div>
        </div>
    )
}
