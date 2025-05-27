"use client"
import Link from "next/link"
import "./(app)/globals.css"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
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
                    <h1 className="text-3xl font-bold mb-4 text-white">Hiba történt</h1>
                    <p className="text-lg text-gray-300 mb-2">Nem sikerült betölteni az oldalt.</p>
                    <p className="text-base text-gray-400">Próbáld újra, vagy lépj vissza az előző oldalra.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 bg-frtRed hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        <RefreshCw size={20} />
                        Újrapróbálás
                    </button>

                    <Link
                        href="/public"
                        className="inline-flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-frtRed"
                    >
                        <Home size={20} />
                        Főoldal
                    </Link>
                </div>
            </div>
        </main>
    )
}
