import Link from "next/link";
import Image from "next/image";
import { Event, Media } from "@/payload-types";
import { CalendarDays, MapPin } from "lucide-react";

interface Props {
  event: Event;
  lang: string; // 'hu' | 'en'
}

function formatDateRange(startISO: string, endISO?: string | null, lang: string = 'hu') {
  const locale = lang === 'en' ? 'en-GB' : 'hu-HU';
  const start = new Date(startISO);
  let end: Date | null = null;
  if (endISO) end = new Date(endISO);

  const sameDay = end && start.toDateString() === end.toDateString();
  const fmt: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  if (!end || sameDay) return start.toLocaleDateString(locale, fmt);
  const startStr = start.toLocaleDateString(locale, fmt);
  const endStr = end!.toLocaleDateString(locale, fmt);
  return `${startStr} – ${endStr}`;
}

export default function UpcomingEventCard({ event, lang }: Props) {
  const imageObj = typeof event.image === 'object' ? (event.image as Media) : null;
  const dateLabel = formatDateRange(event.start_date, event.end_date, lang);
  const title = lang === 'en' ? event.title_eng : event.title;

  return (
    <Link
      href={{ pathname: `/esemenynaptar/${event.slug}`, query: { lang } }}
      className="group relative overflow-hidden rounded-xl border border-neutral-800/60 light:border-neutral-200/80 bg-gradient-to-br from-neutral-900 via-neutral-900/70 to-neutral-800 light:from-white light:via-white/70 light:to-white shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      {imageObj?.url && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={imageObj.url}
            alt={imageObj.alt || title}
            fill
            sizes="(max-width:768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent light:from-white/40 light:via-white/20 light:to-transparent" />
        </div>
      )}
      {/* Content */}
      <div className="relative p-4 flex flex-col gap-3 bg-frtcardBG">
        <h3 className="text-lg font-semibold leading-snug tracking-tight line-clamp-2 group-hover:text-frtRed transition-colors">
          {title}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-neutral-300 light:text-neutral-200">
          <div className="inline-flex items-center gap-2 rounded-md bg-neutral-800/60 light:bg-neutral-200/80 light:text-neutral-800 light:border light:border-neutral-300 px-2 py-1 font-medium text-[13px] text-neutral-200">
            <CalendarDays size={16} className="text-frtRed" />
            <span>{dateLabel}</span>
          </div>
          {event.location && (
            <div className="inline-flex items-center gap-2 rounded-md bg-neutral-800/60 light:bg-neutral-200/80 light:text-neutral-800 light:border light:border-neutral-300 px-2 py-1 font-medium text-[13px] text-neutral-200">
              <MapPin size={16} className="text-frtRed" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
        <div className="mt-auto pt-1 flex justify-end">
          <span className="text-xs uppercase tracking-wide text-frtRed font-semibold group-hover:underline">
            {lang === 'en' ? 'Details' : 'Részletek'} →
          </span>
        </div>
        {/* Decorative ring */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-frtRed/0 group-hover:ring-2 group-hover:ring-frtRed/60 transition-all duration-300" />
      </div>
    </Link>
  );
}
