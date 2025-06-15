"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

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

    const searchParams = useSearchParams();
    const lang = searchParams?.get('lang') === 'en' ? 'en' : 'hu';

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold mb-4">{lang === 'en' ? 'An error occurred' : 'Hiba történt'}</h2>
                <p className="mb-6 text-gray-400">{lang === 'en' ? 'Failed to load publications.' : 'Nem sikerült betölteni a publikációkat.'}</p>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="border-frtRed text-frtRed hover:bg-frtRed hover:text-white"
                >
                    {lang === 'en' ? 'Try again' : 'Próbálja újra'}
                </Button>
            </div>
        </div>
    )
}
