import { Event } from "@/payload-types";
import EventCard from "@/components/events/eventCard";

interface futureEventSectionProps {
  events: Event[];
  lang: string;
}

export default function FutureEventsSection({
  events,
  lang,
}: futureEventSectionProps) {
  const translations = {
    title: lang === "en" ? "Upcomming Events" : "Aktuális Események",
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-12">{translations.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} lang={lang} />
        ))}
      </div>
    </>
  );
}
