import Image from "next/image"
import Link from "next/link"
import { getArticles } from "@/lib/payload-cms"
import { formatDate } from "@/lib/utils"
import {RichText} from "@payloadcms/richtext-lexical/react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hírek",
    description: "Legfrissebb hírek és események",
};

interface NewsPageProps {
    searchParams?: Record<string, string>;
}

export default async function NewsPage(props: NewsPageProps) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    if (props?.searchParams && typeof props.searchParams === 'object') {
        lang = props.searchParams.lang === 'en' ? 'en' : 'hu';
    }

    const translations = {
        title: lang === 'en' ? 'News' : 'Hírek',
        noNews: lang === 'en' ? 'There are currently no news.' : 'Jelenleg nincsenek hírek.',
        readMore: lang === 'en' ? 'Read more →' : 'Tovább olvasom →',
    };

    const articles = await getArticles(lang);

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
                    {articles.map((article) => {
                        // Try to detect orientation if width/height is available
                        const isPortrait = article.featured_image?.width && article.featured_image?.height
                            ? article.featured_image.height > article.featured_image.width
                            : false;
                        return (
                            <article key={article.id} className="bg-[#230505] rounded-lg overflow-hidden">
                                <div className="md:flex">
                                    <div className="md:w-1/2 flex items-center p-2">
                                        <Link href={`/hirek/${article.slug}`} className="w-full">
                                            <div className={isPortrait ? "aspect-[3/4] relative bg-[#230505] flex items-center justify-center max-h-80 md:max-h-96 w-full h-full" : "aspect-[16/9] relative bg-[#230505] flex items-center justify-center max-h-80 md:max-h-96 w-full h-full"}>
                                                <Image
                                                    src={article.featured_image.url || "/placeholder.svg"}
                                                    alt={article.featured_image.alt || article.title}
                                                    fill
                                                    className={isPortrait ? "object-contain object-center" : "object-cover object-center"}
                                                    style={{maxHeight: isPortrait ? '24rem' : undefined, backgroundColor: 'transparent'}}
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-6 md:w-1/2 flex flex-col justify-start">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <span>{formatDate(article.published_date, lang)}</span>
                                            <span className="mx-2">•</span>
                                            <span>{lang === 'en' ? article.category_eng : article.category}</span>
                                        </div>
                                        <Link href={`/hirek/${article.slug}`} className="hover:text-frtRed transition-colors">
                                            <h2 className="text-2xl font-bold mb-3">{lang === 'en' ? article.title_eng : article.title}</h2>
                                        </Link>
                                        <div className="text-gray-300 mb-4">
                                            <RichText data={lang === 'en' ? article.short_description_eng : article.short_description} />
                                        </div>
                                        <Link
                                            href={`/hirek/${article.slug}`}
                                            className="inline-block text-frtRed hover:text-red-400 transition-colors"
                                        >
                                            {translations.readMore}
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}




