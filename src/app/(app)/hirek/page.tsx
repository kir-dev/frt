import { getArticles } from "@/lib/payload-cms"
import { Metadata } from "next";
import NewsCard from "@/components/NewsCard";

export const metadata: Metadata = {
    title: "Hírek",
    description: "Legfrissebb hírek és események",
};

interface NewsPageProps {
    searchParams?: Record<string, string>;
}

export default async function NewsPage(props: NewsPageProps & { searchParams?: Promise<Record<string, string>> }) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    let sp: Record<string, string> | undefined = undefined;
    if (props?.searchParams) {
        sp = await props.searchParams;
        if (sp && typeof sp.lang === 'string' && sp.lang === 'en') {
            lang = 'en';
        }
    }

    const translations = {
        title: lang === 'en' ? 'News' : 'Hírek',
        noNews: lang === 'en' ? 'There are currently no news.' : 'Jelenleg nincsenek hírek.',
        readMore: lang === 'en' ? 'Read more →' : 'Tovább olvasom →',
    };

    const articles = await getArticles();

    if (articles.length === 0) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold text-center mb-12">{translations.title}</h1>
                    <p className="text-center text-xl">{translations.noNews}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-12">{translations.title}</h1>

                <div className="space-y-12">
                    {articles.map((article) => (
                        <NewsCard key={article.id} article={article} lang={lang} readMoreText={translations.readMore} />
                    ))}
                </div>
            </div>
        </main>
    );
}
