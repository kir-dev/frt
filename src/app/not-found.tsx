"use client"

import Link from "next/link"
import "./(app)/globals.css"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-frtRed mb-4 animate-pulse">404</h1>
                    <div className="w-32 h-1 bg-frtRed mx-auto mb-8"></div>
                </div>

                {/* Error Message */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-white">Oldal nem található</h2>
                    <p className="text-xl text-gray-300 mb-2">A keresett oldal nem létezik vagy áthelyezték.</p>
                    <p className="text-lg text-gray-400">Ellenőrizd az URL-t vagy térj vissza a főoldalra.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-frtRed hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        Főoldal
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-frtRed"
                    >
                        <ArrowLeft size={20} />
                        Vissza
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="bg-red-950/30 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center justify-center gap-2">
                        <Search size={20} />
                        Hasznos linkek
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/"
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">Főoldal</span>
                        </Link>
                        <Link
                            href="/tagfelvetel"
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">Tagfelvétel</span>
                        </Link>
                        <Link
                            href="/"
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">Rólunk</span>
                        </Link>
                        <Link
                            href="/"
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">Kapcsolat</span>
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 opacity-20">
                    <div className="flex justify-center space-x-4">
                        <div className="w-2 h-2 bg-frtRed rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-frtRed rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-frtRed rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                </div>
            </div>
        </main>
    )
}
