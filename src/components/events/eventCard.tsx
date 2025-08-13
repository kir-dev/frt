"use client";
import Image from "next/image";
import { Media, Event } from "@/payload-types";
import { useState } from "react";

interface Props {
  event: Event;
  lang: string;
}

export default function EventCard({ event, lang }: Props) {
  const [hovered, setHovered] = useState(false);

  const featuredImageObj =
    typeof event.image === "object" && event.image !== null
      ? (event.image as Media)
      : undefined;

  return (
    <article
      className="relative bg-frtcardBG rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Image
        src={featuredImageObj?.url || "/placeholder.svg"}
        alt={
          featuredImageObj?.alt ||
          (lang === "en" ? event.title_eng : event.title)
        }
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />

      {/* Sliding text container */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-frtcardBG overflow-hidden transition-all duration-500 ${
          hovered ? "h-40 p-4" : "h-12 p-2"
        }`}
      >
        {/* Title */}
        <h3 className="text-white text-center text-xl font-bold py-1">
          {lang === "en" ? event.title_eng : event.title}
        </h3>

        {/* Extra text revealed on hover */}
        <div
          className={`transition-opacity duration-500 ${
            hovered ? "opacity-100 mt-2" : "opacity-0"
          }`}
        >
          <p>szoveg</p>
          <p>szoveg3</p>
        </div>
      </div>
    </article>
  );
}
