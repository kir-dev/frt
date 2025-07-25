"use client"

import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
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
                <Building2 size={64} className="text-gray-600 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Hiba történt</h2>
                <p className="mb-6 text-gray-400">Nem sikerült betölteni az egyesület adatait.</p>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="border-frtRed text-frtRed hover:bg-frtRed hover:text-white"
                >
                    Próbálja újra
                </Button>
            </div>
        </div>
    )
}
