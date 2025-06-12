import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/lib/payload-cms"
import { ImageGallery } from "@/components/image-gallery"
import { formatDate } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

interface ArticlePageProps {
    params: {
        slug: string
    }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    // Await params if needed (Next.js 15+)
    const awaitedParams = await params;
    const article = await getArticleBySlug(awaitedParams.slug)

    if (!article) {
        notFound()
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
                <Link href="/hirek" className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8">
                    <ChevronLeft size={20} />
                    <span>Vissza a hírekhez</span>
                </Link>

                <article>
                    <header className="mb-8">
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                            <span>{formatDate(article.published_date)}</span>
                            <span className="mx-2">•</span>
                            <span>{article.category}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
                    </header>

                    <div className="mb-8 aspect-[16/9] relative">
                        <Image
                            src={featuredImage?.url || "/placeholder.svg"}
                            alt={featuredImage?.alt || article.title}
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <RichText data={article.content} />
                    </div>

                    {galleryImages.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-4">Galéria</h2>
                            <ImageGallery images={galleryImages} />
                        </div>
                    )}
                </article>
            </div>
        </main>
    )
}

