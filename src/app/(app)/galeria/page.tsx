import type React from "react";
import { getGallery } from "@/lib/payload-cms";
import GalleryCard from "@/components/galleryCard";
import { Gallery } from "@/payload-types";

function groupByDate(galleries: Gallery[]) {
  return galleries.reduce((map, item) => {
    const dateObj = new Date(item.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const key = `${year}-${month}`;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
    return map;
  }, new Map());
}

export default async function GalleryPage(props: {
  searchParams?: Promise<Record<string, string>>;
}) {
  let lang = "hu";
  if (props?.searchParams) {
    const sp = await props.searchParams;
    lang = sp && "lang" in sp && sp.lang === "en" ? "en" : "hu";
  }

  const translations = {
    title: lang === "en" ? "Gallery" : "Képek",
    noPictures:
      lang === "en"
        ? "There are currently no available pictures."
        : "Jelenleg nincseenek elérhető képek",
  };

  const galleries = await getGallery();

  const groupedGalleryMap = groupByDate(galleries);

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
      <div className="bg-black container mx-auto py-12 max-w-5xl">
        <h1 className="text-4xl font-bold mb-12">{translations.title}</h1>

        {[...groupedGalleryMap.keys()].map((dateKey, index) => {
          const galleries: Gallery[] = groupedGalleryMap.get(dateKey);
          const date = new Date(dateKey);

          if (galleries.length === 0) {
            return null;
          }

          return (
            <div
              className="bg-black flex flex-col container mx-auto py-12 pb-0 max-w-5xl"
              key={index}
            >
              <div className="h-0.5 !bg-frtRed w-full mx-auto mb-2"></div>
              <h2 className="text-2xl font-bold">
                {lang === "en"
                  ? monthsEnglish[date.getMonth()]
                  : monthsHungarian[date.getMonth()]}
              </h2>
              <div className="grid grid-cols-3 gap-6 mt-8">
                {galleries.map((gallery, index) => {
                  return <GalleryCard gallery={gallery} key={index} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

//<GalleryCard gallery={gallery} key={index}/>;

const monthsEnglish: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsHungarian: string[] = [
  "Január",
  "Február",
  "Március",
  "Április",
  "Május",
  "Június",
  "Július",
  "Augusztus",
  "Szeptember",
  "Október",
  "November",
  "December",
];
