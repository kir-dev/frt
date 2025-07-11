import Link from "next/link"
import { getArticles } from "@/lib/payload-cms"
import SocialFeed from "@/components/social-feed"
import NewsCard from "@/components/NewsCard";

export const metadata = {
    title: "BME Formula Racing Team",
    description: "Üdvözöljük a csapatunk hivatalos weboldalán",
}

export type HomePageProps = {
    searchParams?: Promise<Record<string, string>>;
}

export default async function HomePage(props: HomePageProps) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }
    // Get the most recent article
    const articles = await getArticles()
    const latestArticle = articles.length > 0 ? articles[0] : null

    // Kétnyelvű szövegek
    const texts = {
        teamTitle: {
            hu: "Kik vagyunk mi?",
            en: "Who are we?"
        },
        teamParagraphs: {
            hu: [
                "A BME Formula Racing Teamet 2007 elején hívta életre néhány tehetséges mérnökhallgató, hogy első és anno egyetlen magyar csapatként versenyautót építsenek és részt vegyenek a világméretű Formula Student versenysorozatban.",
                "Az akkor még csak 18 fős alakulatot követte egy 50 fős második generáció, valamint egy harmadik generációs Junior csapat. Mára a hetedik generáció több, mint 100 tagot számlál, az egyetem számos különböző karát képviselve. A csapat mérnökei és menedzserei különböző területeken dolgoznak ugyanazért a célért; minél jobb eredmények eléréséért, valamint hogy megteremtsék a magas szintű anyagi, szervezeti és tárgyi feltételeket. Többek között ennek köszönhető, hogy 2007 óta kitűnően helytálltak a világ legjobbjai között német, angol, olasz és magyar versenyeken.",
                "A Formula Racing Team nagy hangsúlyt fektet az oktatásra, ezért a csapatnál dolgozó idősebb, és nagy tudású mérnökök elméleti ismeretekkel is segítik a Junior csapatot. Minden adott tehát ahhoz, hogy a csapat még évekig képviselje Magyarországot és a BME-t a Formula Student versenyeken."
            ],
            en: [
                "The BME Formula Racing Team was founded in early 2007 by a few talented engineering students to build a race car and participate in the worldwide Formula Student series as the first and, at the time, only Hungarian team.",
                "The original 18-member team was followed by a second generation of 50, and then a third generation Junior team. Today, the seventh generation has more than 100 members, representing many different faculties of the university. Our engineers and managers work in different fields for the same goal: to achieve the best possible results and to create the highest level of financial, organizational, and material conditions. Thanks to this, since 2007, the team has performed excellently among the world's best at German, English, Italian, and Hungarian competitions.",
                "The Formula Racing Team places great emphasis on education, so the older, more experienced engineers in the team also help the Junior team with theoretical knowledge. Everything is in place for the team to represent Hungary and BME at Formula Student competitions for years to come."
            ]
        },
        socialTitle: {
            hu: "Közösségi média",
            en: "Social Media"
        },
        latestNews: {
            hu: "Legfrissebb hír",
            en: "Latest News"
        },
        allNews: {
            hu: "Összes hír megtekintése",
            en: "View all news"
        }
    } as const;
    type Lang = keyof typeof texts.teamTitle;
    const langKey = lang as Lang;

    return (
        <main className="min-h-screen font-frtszoveg bg-black text-white">
            {/* Hero Video Section */}
            <div className="w-full">
                {/* Mobile video container - 16:9 aspect ratio */}
                <div className="block sm:hidden relative w-full" style={{ paddingTop: '56.25%' }}>
                    <iframe
                        src="https://www.youtube.com/embed/5PokC77YMwA?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1&playlist=5PokC77YMwA"
                        title={lang === 'en' ? "BME Formula Racing Team Video" : "BME Formula Racing Team Videó"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                        tabIndex={-1}
                    ></iframe>
                </div>

                {/* Desktop video container - custom aspect ratio */}
                <div className="hidden sm:block relative w-full" style={{ paddingTop: '56.25%' }}>
                    <iframe
                        src="https://www.youtube.com/embed/5PokC77YMwA?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1&playlist=5PokC77YMwA"
                        title={lang === 'en' ? "BME Formula Racing Team Video" : "BME Formula Racing Team Videó"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                        tabIndex={-1}
                    ></iframe>
                </div>

                {/* Fallback for browsers that can't load embeds */}
                <noscript>
                    <div className="bg-gray-900 text-white p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">
                            {lang === 'en' ? 'Video unavailable' : 'Videó nem elérhető'}
                        </h2>
                        <p className="mb-4">
                            {lang === 'en'
                                ? 'JavaScript is required to play the video. Alternatively, you can watch it directly on YouTube.'
                                : 'JavaScript szükséges a videó lejátszásához. Alternatívaként megtekinthető közvetlenül a YouTube-on.'}
                        </p>
                        <a
                            href="https://youtu.be/5PokC77YMwA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            {lang === 'en' ? 'Watch on YouTube' : 'Megtekintés YouTube-on'}
                        </a>
                    </div>
                </noscript>
            </div>
            {/* "Kik vagyunk mi?" section */}
            <section className="relative">
                <div className="container mx-auto px-4 py-16 max-w-5xl">
                    <h1 className="text-4xl font-bold mb-8">{texts.teamTitle[langKey]}</h1>
                    <div className="text-gray-300 space-y-4 max-w-3xl">
                        {texts.teamParagraphs[langKey].map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </div>
            </section>

            {/* Social Media Posts section */}
            <section className="py-16 bg-black">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-8">{texts.socialTitle[langKey]}</h2>
                    <SocialFeed />
                </div>
            </section>

            {/* Latest News Article section */}
            {latestArticle && (
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-8">{texts.latestNews[langKey]}</h2>
                        <NewsCard article={latestArticle} lang={langKey} />
                        <div className="mt-6 text-center">
                            <Link
                                href={lang === 'en' ? "/hirek?lang=en" : "/hirek"}
                                className="px-6 py-3 bg-frtRed hover:bg-red-800 text-white rounded-lg transition-colors"
                            >
                                {texts.allNews[langKey]}
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}
