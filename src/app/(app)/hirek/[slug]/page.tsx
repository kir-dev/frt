import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/lib/payload-cms"
import { ImageGallery } from "@/components/image-gallery"
import { formatDate } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

// --- TÍPUS JAVÍTÁS ---

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<Record<string, string>>;
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    let sp: Record<string, string> | undefined = undefined;
    if (searchParams) {
        sp = await searchParams;
        if (sp && typeof sp.lang === 'string' && sp.lang === 'en') {
            lang = 'en';
        }
    }
    // Await params if needed (Next.js 15+)
    const awaitedParams = await params;
    const article = await getArticleBySlug(awaitedParams.slug);
    if (!article) {
        notFound();
    }

    // Transform gallery images for the ImageGallery component
    const galleryImages = article.gallery
        ? article.gallery.map((item) => {
            const image = item.image && typeof item.image === "object" ? item.image : null;
            return {
                id: image?.id?.toString() || String(item.image),
                url: image?.url || "/placeholder.svg",
                alt: image?.alt || article.title,
            };
        })
        : [];

    // Handle featured image (can be number or object)
    const featuredImage = article.featured_image && typeof article.featured_image === "object"
        ? article.featured_image
        : null;

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href={{ pathname: "/hirek", query: { lang } }} className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8">
                    <ChevronLeft size={20} />
                    <span>{lang === 'en' ? 'Back to news' : 'Vissza a hírekhez'}</span>
                </Link>
                <article>
                    <header className="mb-8">
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                            <span>{formatDate(article.published_date)}</span>
                            <span className="mx-2">•</span>
                            <span>{lang === 'en' ? article.category_eng : article.category}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-6">{lang === 'en' ? article.title_eng : article.title}</h1>
                    </header>
                    <div className="mb-8 w-full flex items-center justify-center rounded-lg">
                        <Image
                            src={featuredImage?.url || "/placeholder.svg"}
                            alt={featuredImage?.alt || (lang === 'en' ? article.title_eng : article.title)}
                            width={featuredImage?.width || 800}
                            height={featuredImage?.height || 1200}
                            className="object-contain object-center rounded-lg"
                            style={{maxWidth: '100%', height: 'auto', backgroundColor: 'transparent'}}
                            priority
                        />
                    </div>
                    <div className="prose prose-invert max-w-none text-white">
                        <RichText data={lang === 'en' ? article.content_eng : article.content} />
                    </div>
                    {galleryImages.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-4">{lang === 'en' ? 'Gallery' : 'Galéria'}</h2>
                            <ImageGallery images={galleryImages} />
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}
