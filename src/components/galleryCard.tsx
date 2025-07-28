import { Media } from "@/payload-types";
import Image from "next/image";
import { Gallery } from "@/payload-types";
import Link from "next/link";

interface Props {
  gallery: Gallery;
  lang?: string;
}
function dateFormatter(date: string): string {
  const realDate = new Date(date);
  const month = String(realDate.getMonth() + 1).padStart(2, "0");
  const day = String(realDate.getDate()).padStart(2, "0");
  return `${month}.${day}.`;
}

export default function GalleryCard({ gallery, lang = "hu" }: Props) {
  const monthAndDay = dateFormatter(gallery.date);
  const images: Media[] = Array.isArray(gallery?.images)
    ? gallery.images
        .map((item) => item.image)
        .filter((img): img is Media => typeof img === "object" && img !== null)
    : [];

  const mainImage: Media = images[0];

  return (
    <Link href={{ pathname: `/galeria/${gallery.slug}`, query: { lang } }}>
      <div className="bg-frtcardBG rounded-lg overflow-hidden">
        <div className="relative w-full">
          <p className="bg-frtcardBG text-white font-semibold absolute z-10 p-2">
            {monthAndDay}
          </p>
          <Image
            src={mainImage?.url || "/placeholder.svg"}
            alt={mainImage?.alt || gallery.title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
        <h3 className="text-white text-center text-xl font-bold py-3">
          {lang === "en" ? gallery.title_eng : gallery.title}
        </h3>
      </div>
    </Link>
  );
}
