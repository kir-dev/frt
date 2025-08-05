"use client";
import { Gallery } from "@/payload-types";
import GalleryCard from "@/components/galleryCard";
import { useState } from "react";
import YearSelectionTab from "@/components/yearSelectionTab";

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
      <YearSelectionTab
        setYearAction={(item) => setSelectedYear(item)}
        listValues={years}
        lang={lang}
      />

      {[...selectedGalleryByYear.keys()].map((month, index) => {
        const galleries: Gallery[] = selectedGalleryByYear.get(month) ?? [];
        //const date = new Date(month);

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
                ? monthsEnglish.get(month)
                : monthsHungarian.get(month)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 mt-8">
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

const monthsEnglish = new Map<string, string>([
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "June"],
  ["07", "July"],
  ["08", "August"],
  ["09", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
]);

const monthsHungarian = new Map<string, string>([
  ["01", "Január"],
  ["02", "Február"],
  ["03", "Március"],
  ["04", "Április"],
  ["05", "Május"],
  ["06", "Június"],
  ["07", "Július"],
  ["08", "Augusztus"],
  ["09", "Szeptember"],
  ["10", "Október"],
  ["11", "November"],
  ["12", "December"],
]);
