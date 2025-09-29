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
    <main className="min-h-screen bg-black text-white light:bg-white light:text-gray-900">
      <div className="bg-black dark:bg-black light:bg-white">
        <div className="container mx-auto pt-8 px-4 md:px-8 max-w-6xl">
          <Link
            href={{ pathname: "/esemenynaptar", query: { lang } }}
            className="inline-flex items-center text-gray-400 light:text-gray-600 hover:text-frtRed transition-colors mb-6 text-sm"
          >
            <ChevronLeft size={18} />
            <span className="ml-1 font-medium tracking-wide">
              {lang === "en" ? "Back to events" : "Vissza az eseményekhez"}
            </span>
          </Link>
        </div>
        {/* HERO */}
        <section className="relative max-w-6xl mx-auto rounded-xl overflow-hidden border border-neutral-800 light:border-neutral-200 shadow-md bg-neutral-900/70 light:bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/50 light:supports-[backdrop-filter]:bg-white/60 min-h-[320px] flex items-stretch">
          {/* Háttérkép vagy fallback gradient */}
          {imageObj?.url ? (
            <div className="absolute inset-0">
              <Image
                src={imageObj.url}
                alt={imageObj.alt || (lang === "en" ? "Event image" : "Esemény képe")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover opacity-70 light:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 light:from-white/70 light:via-white/60 light:to-white/80" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black light:from-white light:via-neutral-100 light:to-white" />
          )}
          <div className="relative z-10 w-full px-6 md:px-10 py-12 md:py-16 flex flex-col justify-end">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight drop-shadow-sm bg-gradient-to-r from-white to-white/70 light:from-black light:to-black/60 bg-clip-text text-transparent">
              {lang === "en" ? event.title_eng : event.title}
            </h1>
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide bg-neutral-900/60 light:bg-white/70 backdrop-blur border-neutral-700/60 light:border-neutral-300 shadow-sm hover:shadow transition">
                <CalendarDays size={16} className="text-frtRed" />
                <span className="uppercase tracking-wide">
                  {dateLabel}
                </span>
              </div>
              {event.location && (
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide bg-neutral-900/60 light:bg-white/70 backdrop-blur border-neutral-700/60 light:border-neutral-300 shadow-sm hover:shadow transition">
                  <MapPin size={16} className="text-frtRed" />
                  <span className="uppercase tracking-wide">{event.location}</span>
                </div>
              )}
              {event.facebookEventLink && (
                <Link
                  href={event.facebookEventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide bg-neutral-900/60 light:bg-white/70 backdrop-blur border-neutral-700/60 light:border-neutral-300 shadow-sm hover:border-frtRed hover:text-frtRed transition"
                >
                  <Facebook size={16} className="text-frtRed" />
                  <span className="uppercase tracking-wide">Facebook</span>
                </Link>
              )}
              {event.linkToPictureFromEvent && (
                <Link
                  href={
                    typeof event.linkToPictureFromEvent === "object"
                      ? `/galeria/${event.linkToPictureFromEvent.slug}`
                      : "#"
                  }
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide bg-neutral-900/60 light:bg-white/70 backdrop-blur border-neutral-700/60 light:border-neutral-300 shadow-sm hover:border-frtRed hover:text-frtRed transition"
                >
                  <Camera size={16} className="text-frtRed" />
                  <span className="uppercase tracking-wide">{lang === "en" ? "Gallery" : "Galéria"}</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Tartalom kártya */}
        <section className="relative max-w-4xl mx-auto px-4 md:px-0 -mt-10 md:-mt-14 pb-20">
          <div className="rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-950/70 light:bg-white/80 backdrop-blur-md shadow-xl p-6 md:p-10 space-y-8">
            <div className="prose prose-invert light:prose-neutral max-w-none text-white light:text-gray-900 rich-text-content leading-relaxed">
              <RichText
                data={lang === "en" ? event.description_eng : event.description}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
