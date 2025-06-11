"use client"

import Link from "next/link"
import { Home, ArrowLeft, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function NotFoundContent() {
    const searchParams = useSearchParams();
    const [language, setLanguage] = useState("hu");
    useEffect(() => {
        if (!searchParams) return;
        const langParam = searchParams.get("lang");
        if (langParam === "en" || langParam === "hu") {
            setLanguage(langParam);
        }
    }, [searchParams]);

    const texts: Record<string, { notFound: string; msg1: string; msg2: string; home: string; back: string; links: string; recruitment: string; about: string; contact: string }> = {
        hu: {
            notFound: "Oldal nem található",
            msg1: "A keresett oldal nem létezik vagy áthelyezték.",
            msg2: "Ellenőrizd az URL-t vagy térj vissza a főoldalra.",
            home: "Főoldal",
            back: "Vissza",
            links: "Hasznos linkek",
            recruitment: "Tagfelvétel",
            about: "Rólunk",
            contact: "Kapcsolat"
        },
        en: {
            notFound: "Page not found",
            msg1: "The page you are looking for does not exist or has been moved.",
            msg2: "Check the URL or return to the homepage.",
            home: "Home",
            back: "Back",
            links: "Useful links",
            recruitment: "Recruitment",
            about: "About us",
            contact: "Contact"
        }
    };
    const t = texts[language];

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
                    <h2 className="text-4xl font-bold mb-4 text-white">{t.notFound}</h2>
                    <p className="text-xl text-gray-300 mb-2">{t.msg1}</p>
                    <p className="text-lg text-gray-400">{t.msg2}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link
                        href={`/?lang=${language}`}
                        className="inline-flex items-center gap-2 bg-frtRed hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        {t.home}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-frtRed"
                    >
                        <ArrowLeft size={20} />
                        {t.back}
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="bg-red-950/30 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center justify-center gap-2">
                        <Search size={20} />
                        {t.links}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={`/?lang=${language}`}
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">{t.home}</span>
                        </Link>
                        <Link
                            href={`/tagfelvetel?lang=${language}`}
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">{t.recruitment}</span>
                        </Link>
                        <Link
                            href={`/?lang=${language}`}
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">{t.about}</span>
                        </Link>
                        <Link
                            href={`/?lang=${language}`}
                            className="block p-3 bg-red-950/50 hover:bg-red-900/50 rounded-lg transition-colors text-center"
                        >
                            <span className="font-medium">{t.contact}</span>
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

export default function Page() {
    return (
        <Suspense>
            <NotFoundContent />
        </Suspense>
    );
}
