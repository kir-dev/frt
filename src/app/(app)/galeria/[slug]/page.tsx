import { getGalleryBySlug } from "@/lib/payload-cms";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/image-gallery";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string>>;
}

export default async function Page({ params, searchParams }: Props) {
  // Nyelvi paraméter kezelése
  let lang = "hu";
  let sp: Record<string, string> | undefined = undefined;
  if (searchParams) {
    sp = await searchParams;
    if (sp && typeof sp.lang === "string" && sp.lang === "en") {
      lang = "en";
    }
  }

  const awaitedParams = await params;
  const gallery = await getGalleryBySlug(awaitedParams.slug);
  if (!gallery) {
    notFound();
  }

  const galleryImages = gallery.images
    ? gallery.images.map((item) => {
        const image =
          item.image && typeof item.image === "object" ? item.image : null;
        return {
          id: image?.id?.toString() || String(item.image),
          url: image?.url || "/placeholder.svg",
          alt: image?.alt || gallery.title,
        };
      })
    : [];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="bg-black min-w-full px-6 container mx-auto py-12">
        <Link
          href={{ pathname: "/galeria", query: { lang } }}
          className="inline-flex items-center text-gray-400 hover:text-red-500"
        >
          <ChevronLeft size={20} />
          <span>
            {lang === "en" ? "Back to Gallery" : "Vissza az albumokhoz"}
          </span>
        </Link>
        <header>
          <h1 className="text-4xl font-bold text-center mb-2">
            {lang === "en" ? gallery.title_eng : gallery.title}
          </h1>
          <h2 className="text-2xl font-semibold text-center mb-12">
            {formatDate(gallery.date)}
          </h2>
        </header>
        <ImageGallery images={galleryImages} />
      </div>
    </main>
  );
}

/*<div
    key={index}
    className="w-full aspect-rectangle overflow-hidden rounded-lg"
>
  <Image
      src={image?.url || "/placeholder.svg"}
      alt={image?.alt || gallery.title}
      width={200}
      height={150}
      className="object-cover w-full h-full"
  />
</div>*/
