import Link from "next/link"
import { getArticles } from "@/lib/payload-cms"
import SocialFeed from "@/components/social-feed"
import NewsCard from "@/components/NewsCard";

export const metadata = {
    title: "Főoldal",
    description: "Üdvözöljük a csapatunk hivatalos weboldalán",
}

export default async function HomePage() {
    // Get the most recent article
    const articles = await getArticles()
    const latestArticle = articles.length > 0 ? articles[0] : null

    return (
        <main className="min-h-screen bg-black text-white">
            {/* "Kik vagyunk mi?" section */}
            <section className="relative">
                <div className="container mx-auto px-4 py-16 max-w-5xl">
                    <h1 className="text-4xl font-bold mb-8">Kik vagyunk mi?</h1>
                    <div className="text-gray-300 space-y-4 max-w-3xl">
                        <p>
                            A csapatunk 2007-ben alakult azzal a céllal, hogy a Budapesti Műszaki és Gazdaságtudományi Egyetem
                            hallgatói számára lehetőséget biztosítson egy versenyképes Formula Student versenyautó tervezésére és
                            építésére.
                        </p>
                        <p>
                            Az évek során csapatunk számos nemzetközi versenyen vett részt, és folyamatosan fejlesztjük autóinkat a
                            legújabb technológiák és innovációk felhasználásával. A csapat tagjai különböző szakterületekről érkeznek,
                            és együtt dolgoznak a közös cél érdekében.
                        </p>
                        <p>
                            A Formula Student versenyeken nem csak az autó teljesítménye számít, hanem a mérnöki tervezés, a
                            költségvetés, az üzleti terv és a csapatmunka is. Ezért a csapatunk különböző csoportokra oszlik, amelyek
                            az autó különböző aspektusaival foglalkoznak, mint például az elektronika, a mechanika és az informatika.
                        </p>
                    </div>
                </div>
            </section>

            {/* Social Media Posts section */}
            <section className="py-16 bg-black">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-8">Közösségi média</h2>
                    <SocialFeed />
                </div>
            </section>

            {/* Latest News Article section */}
            {latestArticle && (
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-8">Legfrissebb hír</h2>
                        <NewsCard article={latestArticle} />
                        <div className="mt-6 text-center">
                            <Link
                                href="/hirek"
                                className="inline-block px-6 py-3 bg-frtRed hover:bg-red-800 text-white rounded-lg transition-colors"
                            >
                                Összes hír megtekintése
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}
