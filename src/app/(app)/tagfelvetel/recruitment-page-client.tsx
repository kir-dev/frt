"use client"
import { RichText } from "@payloadcms/richtext-lexical/react"
import {Recruitment} from "@/payload-types";

interface TOCItem {
    id: string
    title: string
    level: number
}

interface RecruitmentPageClientProps {
    recruitmentData: Recruitment[]
    lang: string
}

export default function RecruitmentPageClient({ recruitmentData, lang }: RecruitmentPageClientProps) {
    // Check if there are any open positions
    const hasOpenPositions = recruitmentData.some((group) => group.positions.some((position) => position.positionOpen))

    // Fordítások kezelése
    const translations = {
        title: lang === "en" ? "Continuous Recruitment" : "Folyamatos tagfelvétel",
        noPositions: lang === "en" ? "There are currently no open positions." : "Jelenleg nincsenek nyitott pozíciók.",
        interested: lang === "en" ? "Interested in any of these positions?" : "Érdeklődsz valamelyik pozíció iránt?",
        apply: lang === "en" ? "Apply now!" : "Jelentkezz most!",
    }

    // Generate table of contents items
    const tocItems: TOCItem[] = []

    // Add groups with open positions to TOC
    recruitmentData.forEach((group) => {
        const openPositions = group.positions.filter((position) => position.positionOpen)
        if (openPositions.length > 0) {
            tocItems.push({
                id: `group-${group.id}`,
                title: lang === "en" ? group.groupNameEng : group.groupName,
                level: 0,
            })
        }
    })

    // Improved scroll function that accounts for navbar height
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // Get navbar height to offset the scroll position
            const navbar = document.querySelector("nav")
            const navbarHeight = navbar ? navbar.offsetHeight : 80 // Default to 80px if navbar not found

            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - navbarHeight - 20 // Extra 20px for spacing

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
    }

    if (!hasOpenPositions) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold text-center mb-12">{translations.title}</h1>
                    <p className="text-center text-xl">{translations.noPositions}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl lg:mr-80">
                <h1 id="main-title" className="text-3xl font-bold text-center mb-12">
                    {translations.title}
                </h1>

                {recruitmentData.map((group, groupIdx) => {
                    // Filter only open positions
                    const openPositions = group.positions.filter((position) => position.positionOpen)

                    // Skip groups with no open positions
                    if (openPositions.length === 0) return null

                    const isLastGroup =
                        recruitmentData.filter((g) => g.positions.some((p) => p.positionOpen)).length - 1 === groupIdx

                    return (
                        <div key={group.id}>
                            <section id={`group-${group.id}`} className="mb-16">
                                <div className="bg-red-950/50 rounded-lg p-6 hover:bg-red-900/50 transition-colors mb-8">
                                    <h2 className="text-3xl font-bold mb-4">{lang === "en" ? group.groupNameEng : group.groupName}</h2>
                                    <div className="rich-text-content text-gray-300">
                                        <RichText data={lang === "en" ? group.descriptionEng : group.description} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {openPositions.map((position) => (
                                        <div
                                            key={position.id}
                                            className="bg-red-950/50 rounded-lg p-6 hover:bg-red-900/50 transition-colors"
                                        >
                                            <h3 className="text-xl font-bold mb-3 text-red-500">
                                                {lang === "en" ? position.positionNameEng : position.positionName}
                                            </h3>
                                            <div className="rich-text-content text-gray-300">
                                                <RichText
                                                    data={lang === "en" ? position.positionDescriptionEng : position.positionDescription}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            {!isLastGroup && <div className="border-t border-frtRed my-12 mx-auto max-w-7xl"></div>}
                        </div>
                    )
                })}

                <div id="application-section" className="lg:hidden mt-12 text-center">
                    <p className="text-xl mb-4">{translations.interested}</p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfoRr50h0nzuhrctVWgNhOOm003Yd38Vw1jNdhWAvOocf16zQ/viewform?usp=header"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        {translations.apply}
                    </a>
                </div>
            </div>

            <div className="fixed right-4 top-[196px] z-50 hidden lg:block">
                {/* Table of Contents Section */}
                <div className="bg-red-950/80 backdrop-blur-sm rounded-lg p-5 w-64 mb-4">
                    <h3 className="text-base font-bold mb-4 text-red-400">{lang === "en" ? "Table of Contents" : "Tartalomjegyzék"}</h3>
                    <nav className="space-y-3">
                        {tocItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`block text-left transition-colors hover:text-red-400 w-full 
                                    ${item.level === 1 ? "pl-3" : ""}`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Application Button Section - Separate from TOC */}
                {hasOpenPositions && (
                    <div className="bg-red-950/80 backdrop-blur-sm rounded-lg p-5 text-center">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfoRr50h0nzuhrctVWgNhOOm003Yd38Vw1jNdhWAvOocf16zQ/viewform?usp=header"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-base w-full"
                        >
                            {translations.apply}
                        </a>
                    </div>
                )}
            </div>
        </main>
    )
}

