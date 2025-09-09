import { RichText } from "@payloadcms/richtext-lexical/react";
import { getEventBySlug } from "@/lib/payload-cms";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Facebook, Camera } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string>>;
}

export default async function EventDescriptionPAge({
  params,
  searchParams,
}: Props) {
  let lang = "hu";
  let sp: Record<string, string> | undefined = undefined;
  if (searchParams) {
    sp = await searchParams;
    if (sp && sp.lang === "en") {
      lang = "en";
    }
  }

  const awaitedParams = await params;
  const event = await getEventBySlug(awaitedParams.slug);
  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-0">
      <div className="bg-black container mx-auto py-12 max-w-5xl">
        <Link
          href={{ pathname: "/esemenynaptar", query: { lang } }}
          className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8"
        >
          <ChevronLeft size={20} />
          <span>
            {lang === "en" ? "Back to Event" : "Vissza az eseményekhez"}
          </span>
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          {lang === "en" ? event.title_eng : event.title}
        </h1>
        {event.facebookEventLink && (
          <Link
            href={event.facebookEventLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row justify-start items-center text-frtRed"
          >
            <Facebook size={14} />
            <span className="text-sm font-bold ml-2">
              {lang === "en" ? "Facebook event" : "Facebook esemény"}
            </span>
          </Link>
        )}
        {event.linkToPictureFromEvent && (
          <Link
            href={
              typeof event.linkToPictureFromEvent === "object"
                ? `/galeria/${event.linkToPictureFromEvent.slug}`
                : "#"
            }
            className="flex flex-row justify-start items-center text-frtRed"
          >
            <Camera size={14} />
            <span className="text-sm font-bold ml-2">
              {lang === "en"
                ? "Pictures from the event"
                : "Képek az eseményről"}
            </span>
          </Link>
        )}
        <div className="prose prose-invert max-w-none text-white mt-12">
          <RichText
            data={lang === "en" ? event.description_eng : event.description}
          />
        </div>
      </div>
    </main>
  );
}
