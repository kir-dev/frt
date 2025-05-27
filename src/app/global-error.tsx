"use client"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
        <body className="bg-black text-white">
        <main className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <AlertTriangle className="w-24 h-24 text-frtRed mx-auto mb-4" />
                    <div className="w-32 h-1 bg-frtRed mx-auto mb-8"></div>
                </div>

                {/* Error Message */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-white">Valami hiba történt</h1>
                    <p className="text-xl text-gray-300 mb-2">Váratlan hiba lépett fel az alkalmazásban.</p>
                    <p className="text-lg text-gray-400">Próbáld újra, vagy térj vissza a főoldalra.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
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

                {/* Error Details (Development) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="bg-red-950/30 rounded-lg p-6 max-w-2xl mx-auto text-left">
                        <h3 className="text-lg font-bold mb-2 text-red-400">Fejlesztői információ:</h3>
                        <pre className="text-sm text-gray-300 overflow-auto">{error.message}</pre>
                        {error.digest && <p className="text-sm text-gray-400 mt-2">Error ID: {error.digest}</p>}
                    </div>
                )}
            </div>
        </main>
        </body>
        </html>
    )
}
