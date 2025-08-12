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
      className="bg-frtcardBG rounded-lg overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={featuredImageObj?.url || "/placeholder.svg"}
        alt={
          featuredImageObj?.alt || lang === "en" ? event.title_eng : event.title
        }
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />
      <h3 className="text-white text-center text-xl font-bold py-3">
        {lang === "en" ? event.title_eng : event.title}
      </h3>
    </article>
  );
}
