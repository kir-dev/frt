import { getAllEvents } from "@/lib/payload-cms";
import Calendar, { CalendarEventInput } from "@/components/events/calendar";
import type { Event as EventType } from "@/payload-types";

interface Props {
  searchParams?: Promise<Record<string, string>>;
}

export const revalidate = 300; // 5 percenként frissülhet

export default async function EventCalendarPage({ searchParams }: Props) {
  let lang: "hu" | "en" = "hu";
  if (searchParams) {
    const sp = await searchParams;
    if (sp && sp.lang === "en") lang = "en";
  }

  const events: EventType[] = await getAllEvents();

  const calendarEvents: CalendarEventInput[] = events.map((ev) => {
    const startFull = ev.start_date; // ISO
    const endFull = ev.end_date || ev.start_date; // ha nincs end -> ugyanaz a nap

    // YYYY-MM-DD formátumra vágás
    const start = new Date(startFull).toISOString().substring(0, 10);
    const end = new Date(endFull).toISOString().substring(0, 10);

    return {
      id: String(ev.id),
      title: lang === "en" ? ev.title_eng : ev.title,
      start,
      end, // all-day multi-day esetén a komponens +1 napot hozzáad
      allDay: true,
      url: `/esemenynaptar/${ev.slug}?lang=${lang}`,
      extendedProps: {
        location: ev.location,
        facebook: ev.facebookEventLink || undefined,
        galleryLinked: Boolean(ev.linkToPictureFromEvent),
      },
    };
  });

  return (
    <main className="min-h-screen bg-black text-white light:bg-white light:text-gray-900 px-4 md:px-0">
      <div className="bg-black dark:bg-black light:bg-white container mx-auto py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {lang === "en" ? "Event Calendar" : "Eseménynaptár"}
            </h1>
            <p className="text-neutral-400 light:text-neutral-600 text-sm max-w-prose">
              {lang === "en"
                ? "Browse our past and upcoming events in the calendar. Click an event for details."
                : "Böngéssz a múltbeli és közelgő események között a naptárban. Kattints a részletekért."}
            </p>
          </div>
        </div>
        <Calendar events={calendarEvents} lang={lang} />
      </div>
    </main>
  );
}
