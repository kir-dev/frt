import { getRecruitmentData } from "@/lib/payload-cms"
import { RichText } from '@payloadcms/richtext-lexical/react'

export const metadata = {
    title: "Folyamatos tagfelvétel",
    description: "Nyitott pozíciók a csapatunkban",
}

export default async function RecruitmentPage(props: any) {
    // Nyelvi paraméter kezelése, hasonlóan a támogatók oldalhoz
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = typeof props.searchParams.then === 'function' ? await props.searchParams : props.searchParams;
        lang = sp?.lang === 'en' ? 'en' : 'hu';
    }

    const recruitmentData = await getRecruitmentData()

    // Check if there are any open positions
    const hasOpenPositions = recruitmentData.some((group) => group.positions.some((position) => position.positionOpen))

    // Fordítások kezelése
    const translations = {
        title: lang === 'en' ? "Continuous Recruitment" : "Folyamatos tagfelvétel",
        noPositions: lang === 'en' ? "There are currently no open positions." : "Jelenleg nincsenek nyitott pozíciók.",
        interested: lang === 'en' ? "Interested in any of these positions?" : "Érdeklődsz valamelyik pozíció iránt?",
        apply: lang === 'en' ? "Apply now!" : "Jelentkezz most!"
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
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold text-center mb-12">{translations.title}</h1>

                {recruitmentData.map((group, groupIdx) => {
                    // Filter only open positions
                    const openPositions = group.positions.filter((position) => position.positionOpen)

                    // Skip groups with no open positions
                    if (openPositions.length === 0) return null

                    const isLastGroup = recruitmentData.filter(g => g.positions.some(p => p.positionOpen)).length - 1 === groupIdx;

                    return (
                        <div key={group.id}>
                            <section className="mb-16">
                                <div className="bg-red-950/50 rounded-lg p-6 hover:bg-red-900/50 transition-colors mb-8">
                                    <h2 className="text-3xl font-bold mb-4">{lang === 'en' ? group.groupNameEng : group.groupName}</h2>
                                    <div className="rich-text-content text-gray-300">
                                        <RichText data={lang === 'en' ? group.descriptionEng : group.description} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {openPositions.map((position) => (
                                        <div key={position.id} className="bg-red-950/50 rounded-lg p-6 hover:bg-red-900/50 transition-colors">
                                            <h3 className="text-xl font-bold mb-3 text-red-500">
                                                {lang === 'en' ? position.positionNameEng : position.positionName}
                                            </h3>
                                            <div className="rich-text-content text-gray-300">
                                                <RichText data={lang === 'en' ? position.positionDescriptionEng : position.positionDescription} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            {!isLastGroup && (
                                <div className="border-t border-frtRed my-12 mx-auto max-w-7xl"></div>
                            )}
                        </div>
                    )
                })}

                <div className="mt-12 text-center">
                    <p className="text-xl mb-4">{translations.interested}</p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfoRr50h0nzuhrctVWgNhOOm003Yd38Vw1jNdhWAvOocf16zQ/viewform?usp=header"
                        target="_blank"
                        className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        {translations.apply}
                    </a>
                </div>
            </div>
        </main>
    )
}
