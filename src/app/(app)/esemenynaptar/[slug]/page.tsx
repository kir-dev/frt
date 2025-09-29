import { RichText } from "@payloadcms/richtext-lexical/react";
import { getEventBySlug } from "@/lib/payload-cms";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Facebook, Camera, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

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

  // Dátum formázás helper
  function formatDateRange(startISO: string, endISO?: string | null) {
    const locale = lang === "en" ? "en-GB" : "hu-HU";
    const start = new Date(startISO);
    let end: Date | null = null;
    if (endISO) {
      end = new Date(endISO);
    }

    const sameDay = end && start.toDateString() === end.toDateString();

    const dateFormatter: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (!end) {
      return start.toLocaleDateString(locale, dateFormatter);
    }

    if (sameDay) {
      return start.toLocaleDateString(locale, dateFormatter);
    }

    // Ha különböző napok
    const startStr = start.toLocaleDateString(locale, dateFormatter);
    const endStr = end.toLocaleDateString(locale, dateFormatter);
    if (lang === "en") {
      return `${startStr} – ${endStr}`;
    }
    return `${startStr} – ${endStr}`; // magyarban is működik így egyszerűen
  }

  const dateLabel = formatDateRange(event.start_date, event.end_date || undefined);
  const imageObj = typeof event.image === "object" ? event.image : null;
  const isMultiDay = !!(event.end_date && new Date(event.start_date).toDateString() !== new Date(event.end_date).toDateString());

  return (
    <main className="min-h-screen bg-black text-white light:bg-white light:text-gray-900 px-4 md:px-0">
      <div className="bg-black dark:bg-black light:bg-white container mx-auto py-12 max-w-5xl">
        <Link
          href={{ pathname: "/esemenynaptar", query: { lang } }}
          className="inline-flex items-center text-gray-400 light:text-gray-600 hover:text-frtRed mb-8 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">
            {lang === "en" ? "Back to events" : "Vissza az eseményekhez"}
          </span>
        </Link>
        <article className="space-y-6">
          <header>
            <h1 className="text-4xl font-bold leading-tight tracking-tight mb-3">
              {lang === "en" ? event.title_eng : event.title}
            </h1>
            {imageObj?.url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-neutral-100 shadow-sm mb-5">
                <Image
                  src={imageObj.url}
                  alt={imageObj.alt || (lang === "en" ? "Event image" : "Esemény képe")}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 960px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-sm items-start mt-2">
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded-md bg-neutral-900/60 light:bg-neutral-100 border border-neutral-800 light:border-neutral-200">
                <CalendarDays size={16} className="text-frtRed" />
                <span className="font-medium">{dateLabel}</span>
              </div>
              {event.location && (
                <div className="inline-flex items-center gap-2 py-1 px-3 rounded-md bg-neutral-900/60 light:bg-neutral-100 border border-neutral-800 light:border-neutral-200">
                  <MapPin size={16} className="text-frtRed" />
                  <span className="font-medium">{event.location}</span>
                </div>
              )}
              {event.facebookEventLink && (
                <Link
                  href={event.facebookEventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-1 px-3 rounded-md bg-neutral-900/60 light:bg-neutral-100 border border-neutral-800 light:border-neutral-200 hover:border-frtRed hover:text-frtRed transition-colors"
                >
                  <Facebook size={16} className="text-frtRed" />
                  <span className="font-medium">
                    {lang === "en" ? "Facebook" : "Facebook"}
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
                  className="inline-flex items-center gap-2 py-1 px-3 rounded-md bg-neutral-900/60 light:bg-neutral-100 border border-neutral-800 light:border-neutral-200 hover:border-frtRed hover:text-frtRed transition-colors"
                >
                  <Camera size={16} className="text-frtRed" />
                  <span className="font-medium">
                    {lang === "en" ? "Gallery" : "Galéria"}
                  </span>
                </Link>
              )}
            </div>
          </header>
          <div className="prose prose-invert light:prose-neutral max-w-none text-white light:text-gray-900 rich-text-content">
            <RichText
              data={lang === "en" ? event.description_eng : event.description}
            />
          </div>
        </article>
      </div>
    </main>
  );
}
