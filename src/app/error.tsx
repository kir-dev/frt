"use client"
import Link from "next/link"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function Error({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const searchParams = useSearchParams();
    const [language, setLanguage] = useState("hu");
    useEffect(() => {
        const langParam = searchParams.get("lang");
        if (langParam === "en" || langParam === "hu") {
            setLanguage(langParam);
        }
    }, [searchParams]);

    const texts: Record<string, { title: string; msg1: string; msg2: string; retry: string; home: string }> = {
        hu: {
            title: "Hiba történt",
            msg1: "Nem sikerült betölteni az oldalt.",
            msg2: "Próbáld újra, vagy lépj vissza az előző oldalra.",
            retry: "Újrapróbálás",
            home: "Főoldal"
        },
        en: {
            title: "An error occurred",
            msg1: "Failed to load the page.",
            msg2: "Try again or go back to the previous page.",
            retry: "Retry",
            home: "Home"
        }
    };
    const t = texts[language];

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <AlertCircle className="w-20 h-20 text-frtRed mx-auto mb-4" />
                    <div className="w-32 h-1 bg-frtRed mx-auto mb-8"></div>
                </div>

                {/* Error Message */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-4 text-white">{t.title}</h1>
                    <p className="text-lg text-gray-300 mb-2">{t.msg1}</p>
                    <p className="text-base text-gray-400">{t.msg2}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 bg-frtRed hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        <RefreshCw size={20} />
                        {t.retry}
                    </button>

                    <Link
                        href={`/?lang=${language}`}
                        className="inline-flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-frtRed"
                    >
                        <Home size={20} />
                        {t.home}
                    </Link>
                </div>
            </div>
        </main>
    )
}
