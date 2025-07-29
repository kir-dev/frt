import { getGallery } from "@/lib/payload-cms";
import { Gallery } from "@/payload-types";
import GallerySection from "@/components/gallerySection";
import GalleryCard from "@/components/galleryCard";

function groupByDate(galleries: Gallery[]) {
  return galleries.reduce((yearMap, item) => {
    const dateObj = new Date(item.date);
    const year = String(dateObj.getFullYear());
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-indexed

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map());
    }

    const monthMap = yearMap.get(year);
    if (!monthMap?.has(month)) {
      monthMap?.set(month, []);
    }

    monthMap?.get(month)?.push(item);
    return yearMap;
  }, new Map<string, Map<string, Gallery[]>>());
}

export default async function GalleryPage(props: {
  searchParams?: Promise<Record<string, string>>;
}) {
  let lang = "hu";
  if (props?.searchParams) {
    const sp = await props.searchParams;
    lang = sp && "lang" in sp && sp.lang === "en" ? "en" : "hu";
  }

  const galleries = await getGallery();

  const groupedGalleryMap = groupByDate(galleries);

  const translations = {
    title: lang === "en" ? "Gallery" : "Képek",
    noPictures:
      lang === "en"
        ? "There are currently no available pictures."
        : "Jelenleg nincseenek elérhető képek",
  };

  if (galleries.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-3xl font-bold text-center mb-12">
            {translations.title}
          </h1>
          <p className="text-center text-xl">{translations.noPictures}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <GallerySection
        lang={lang}
        groupedGalleryMap={groupedGalleryMap}
        translations={translations}
      />
    </main>
  );
}

//<GalleryCard gallery={gallery} key={index}/>;
