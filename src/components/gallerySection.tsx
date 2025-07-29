"use client";
import { Gallery } from "@/payload-types";
import GalleryCard from "@/components/galleryCard";
import Combobox from "@/components/comboBox";
import { useState } from "react";

interface GalleryProps {
  lang: string;
  groupedGalleryMap: Map<string, Map<string, Gallery[]>>;
  translations: { title: string; noPictures: string };
}

export default function GallerySection({
  lang,
  groupedGalleryMap,
  translations,
}: GalleryProps) {
  const years = [...groupedGalleryMap.keys()];

  const [selectedYear, setSelectedYear] = useState<string>(years[0]);
  const selectedGalleryByYear: Map<string, Gallery[]> =
    groupedGalleryMap.get(selectedYear) ?? new Map();

  return (
    <div className="bg-black container mx-auto py-12 max-w-5xl">
      <h1 className="text-4xl font-bold mb-12">{translations.title}</h1>
      <Combobox setYear={(item) => setSelectedYear(item)} listValues={years} />

      {[...selectedGalleryByYear.keys()].map((dateKey, index) => {
        const galleries: Gallery[] = selectedGalleryByYear.get(dateKey) ?? [];
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
  );
}

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
