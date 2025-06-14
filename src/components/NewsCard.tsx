import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Article, Media } from "@/payload-types";

interface NewsCardProps {
  article: Article;
  lang?: string;
  readMoreText?: string;
}

export default function NewsCard({ article, lang = 'hu', readMoreText = 'Tovább olvasom →' }: NewsCardProps) {
  const featuredImageObj = typeof article.featured_image === 'object' && article.featured_image !== null ? article.featured_image as Media : undefined;
  const isPortrait = featuredImageObj?.width && featuredImageObj?.height
    ? featuredImageObj.height > featuredImageObj.width
    : false;

  return (
    <article className="bg-frtcardBG rounded-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 flex items-center p-2">
          <Link href={{ pathname: `/hirek/${article.slug}`, query: { lang } }} className="w-full">
            <div className={isPortrait ? "aspect-[3/4] relative bg-frtcardBG flex items-center justify-center max-h-80 md:max-h-96 w-full h-full" : "aspect-[16/9] relative bg-frtcardBG flex items-center justify-center max-h-80 md:max-h-96 w-full h-full"}>
              <Image
                src={featuredImageObj?.url || "/placeholder.svg"}
                alt={featuredImageObj?.alt || article.title}
                fill
                className={isPortrait ? "object-contain object-center" : "object-cover object-center"}
                style={isPortrait ? { maxHeight: '24rem', backgroundColor: 'transparent' } : { backgroundColor: 'transparent' }}
              />
            </div>
          </Link>
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-start">
          <div className="flex items-center text-gray-400 text-sm mb-2">
            <span>{formatDate(article.published_date)}</span>
            <span className="mx-2">•</span>
            <span>{lang === 'en' ? article.category_eng : article.category}</span>
          </div>
          <Link href={{ pathname: `/hirek/${article.slug}`, query: { lang } }} className="hover:text-frtRed transition-colors">
            <h2 className="text-2xl font-bold mb-3">{lang === 'en' ? article.title_eng : article.title}</h2>
          </Link>
          <div className="text-gray-300 mb-4">
            <RichText data={lang === 'en' ? article.short_description_eng : article.short_description} />
          </div>
          <Link
            href={{ pathname: `/hirek/${article.slug}`, query: { lang } }}
            className="inline-block text-frtRed hover:text-red-400 transition-colors"
          >
            {readMoreText}
          </Link>
        </div>
      </div>
    </article>
  );
}
