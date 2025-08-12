import { getFutureEvents, getPreviousEvents } from "@/lib/payload-cms";
import FutureEventsSection from "@/components/events/futureEventsSection";

export default async function EventPage(props: {
  searchParams?: Promise<Record<string, string>>;
}) {
  let lang = "hu";
  if (props?.searchParams) {
    const sp = await props.searchParams;
    lang = sp && "lang" in sp && sp.lang === "en" ? "en" : "hu";
  }

  const futureEvents = await getFutureEvents();
  const previousEvents = await getPreviousEvents();

  const translations = {
    pastEventsTitle: lang === "en" ? "Previous Events" : "Korábbi Események",
  };

  // TODO - separate the future and the previous events

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="bg-black container mx-auto py-12 max-w-5xl">
        <FutureEventsSection events={futureEvents} lang={lang} />
      </div>
    </main>
  );
}
