import { getGalleryBySlug } from "@/lib/payload-cms";
import { formatDate } from "@/lib/utils";
import { Media } from "@/payload-types";
import Image from "next/image";

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
    return <p>Nincsenek kepek</p>;
  }

  //Transform gallery images
  const images: Media[] = Array.isArray(gallery?.images)
    ? gallery.images
        .map((item) => item.image)
        .filter((img): img is Media => typeof img === "object" && img !== null)
    : [];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="bg-black min-w-full  px-6 container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-2">
          {lang === "en" ? gallery.title_eng : gallery.title}
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-12">
          {formatDate(gallery.date)}
        </h2>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {images.map((image, index) => {
            return (
              <div
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
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
