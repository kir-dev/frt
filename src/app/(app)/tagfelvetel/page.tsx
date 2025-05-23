import { getRecruitmentData } from "@/lib/payload-cms"
import {RichText} from '@payloadcms/richtext-lexical/react'

export const metadata = {
    title: "Folyamatos tagfelvétel",
    description: "Nyitott pozíciók a csapatunkban",
}

export default async function RecruitmentPage() {
    const recruitmentData = await getRecruitmentData()

    // Check if there are any open positions
    const hasOpenPositions = recruitmentData.some((group) => group.positions.some((position) => position.positionOpen))

    if (!hasOpenPositions) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold text-center mb-12">Folyamatos tagfelvétel</h1>
                    <p className="text-center text-xl">Jelenleg nincsenek nyitott pozíciók.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold text-center mb-12">Folyamatos tagfelvétel</h1>

                {recruitmentData.map((group, groupIdx) => {
                    // Filter only open positions
                    const openPositions = group.positions.filter((position) => position.positionOpen)

                    // Skip groups with no open positions
                    if (openPositions.length === 0) return null

                    const isLastGroup = recruitmentData.filter(g => g.positions.some(p => p.positionOpen)).length - 1 === groupIdx;

                    return (
                        <>
                            <section key={group.id} className="mb-16">
                                <div className="bg-red-950/50 rounded-lg p-6 hover:bg-red-900/50 transition-colors mb-8">
                                    <h2 className="text-3xl font-bold mb-4">{group.groupName}</h2>
                                    <div className="rich-text-content text-gray-300">
                                        <RichText data={group.description} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {openPositions.map((position) => (
                                        <div key={position.id} className="bg-red-950/50 rounded-lg p-6 hover:bg-red-900/50 transition-colors">
                                            <h3 className="text-xl font-bold mb-3 text-red-500">{position.positionName}</h3>
                                            <div className="rich-text-content text-gray-300">
                                                <RichText data={position.positionDescription} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            {!isLastGroup && (
                                <div className="border-t border-frtRed my-12 mx-auto max-w-7xl"></div>
                            )}
                        </>
                    )
                })}

                <div className="mt-12 text-center">
                    <p className="text-xl mb-4">Érdeklődsz valamelyik pozíció iránt?</p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfoRr50h0nzuhrctVWgNhOOm003Yd38Vw1jNdhWAvOocf16zQ/viewform?usp=header"
                        target="_blank"
                        className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Jelentkezz most!
                    </a>
                </div>
            </div>
        </main>
    )
}
