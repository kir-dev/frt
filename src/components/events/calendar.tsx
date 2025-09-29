"use client";
import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import huLocale from "@fullcalendar/core/locales/hu";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { useRouter } from "next/navigation";

export interface CalendarEventInput {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD (exclusive for all-day events after transform)
  url?: string;
  allDay?: boolean;
  extendedProps?: Record<string, unknown>;
}

interface Props {
  events: CalendarEventInput[];
  lang: "hu" | "en";
}

// Segédfüggvény: hozzáad egy napot (multi-day end exclusive kezeléséhez)
function addOneDay(isoDate: string) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + 1);
  return d.toISOString().substring(0, 10); // csak YYYY-MM-DD formátum
}

const Calendar: React.FC<Props> = ({ events, lang }) => {
  const router = useRouter();
  const transformedEvents = useMemo(() => {
    return events.map((e) => {
      // Ha all-day esemény (dátum csak YYYY-MM-DD), FullCalendar allDay-ként kezeli
      // Multi-day esemény esetén az end exclusive, így +1 nap
      let end = e.end;
      if (e.end && e.allDay) {
        end = addOneDay(e.end);
      }
      return { ...e, end };
    });
  }, [events]);

  return (
    <div className="rounded-lg bg-neutral-900 dark:bg-neutral-900 light:bg-white p-4 shadow-md border border-neutral-800 light:border-neutral-200 transition-colors">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        aspectRatio={1.5}
        height="auto"
        locales={[huLocale, enLocale]}
        locale={lang === "en" ? "en-gb" : "hu"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        buttonText={{
          today: lang === "en" ? "Today" : "Ma",
          month: lang === "en" ? "Month" : "Hónap",
          week: lang === "en" ? "Week" : "Hét",
          day: lang === "en" ? "Day" : "Nap",
        }}
        events={transformedEvents}
        eventClick={(info) => {
          // Ha van url engedjük a default navigációt (anchor) – de SPA-hoz használjunk next Link-et is (renderHook?)
          if (info.event.url) {
            info.jsEvent.preventDefault();
            // client oldali navigáció
            router.push(info.event.url);
          }
        }}
        dayMaxEvents={3}
        displayEventEnd={true}
        eventClassNames={() => [
          "bg-frtRed/90 hover:bg-frtRed border-none text-white cursor-pointer rounded-sm px-1 py-[2px]",
        ]}
        dayHeaderClassNames={() => ["text-[10px] md:text-xs font-medium text-neutral-300 light:text-neutral-600"]}
        titleFormat={{ year: "numeric", month: "long" }}
      />
      {events.length === 0 && (
        <p className="text-center text-neutral-400 light:text-neutral-600 mt-4">
          {lang === "en" ? "No events" : "Nincs esemény"}
        </p>
      )}
      <div className="mt-6 text-xs text-neutral-400 light:text-neutral-600 flex flex-wrap gap-4">
      </div>
      <p className="text-neutral-500 light:text-neutral-500 text-[10px] mt-4">
        {lang === "en"
          ? "Click an event to see details. Multi-day events span their duration."
          : "Kattints egy eseményre a részletekért. A többnapos események átfogják a teljes időtartamukat."}
      </p>
      <style jsx global>{`
        /* Alap stílusok */
        .fc { --fc-border-color: #262626; font-size: 12px; }
        .light .fc { --fc-border-color: #e5e5e5; }
        .fc .fc-toolbar-title { font-size: 1.1rem; font-weight: 600; }
        @media (min-width: 768px) { .fc .fc-toolbar-title { font-size: 1.35rem; } }

        /* Gombok */
        .fc .fc-button { background:#171717; border:1px solid #404040; color:#e5e5e5; text-transform:capitalize; font-size:11px; }
        .fc .fc-button:hover { background:#262626; }
        .fc .fc-button.fc-button-active { background:#D51028; border-color:#D51028; }
        .light .fc .fc-button { background:#ffffff; color:#1f2937; border:1px solid #d1d5db; }
        .light .fc .fc-button:hover { background:#f3f4f6; }
        .light .fc .fc-button.fc-button-active { background:#D51028; color:#fff; border-color:#D51028; }

        /* Nap fejlécek */
        .fc .fc-col-header-cell { background:#111111; }
        .light .fc .fc-col-header-cell { background:#f8f9fa; }
        .fc .fc-col-header-cell-cushion { padding:4px 0; color:#d4d4d4; }
        .light .fc .fc-col-header-cell-cushion { color:#4b5563; }

        /* Napi cellák */
        .fc .fc-daygrid-day { background:#000000; }
        .light .fc .fc-daygrid-day { background:#ffffff; }
        .fc .fc-daygrid-day-frame { padding:2px; }
        .fc .fc-daygrid-day-number { color:#d4d4d4; font-size:0.65rem; }
        .light .fc .fc-daygrid-day-number { color:#374151; }
        @media (min-width: 768px) { .fc .fc-daygrid-day-number { font-size:0.75rem; } }

        /* Mai nap */
        .fc .fc-day-today { background: rgba(213,16,40,0.15); }
        .light .fc .fc-day-today { background: rgba(213,16,40,0.10); }

        /* Események */
        .fc .fc-daygrid-event { font-size:0.6rem; line-height:1.05; }
        @media (min-width:768px){ .fc .fc-daygrid-event { font-size:0.7rem; } }
        .light .fc .fc-daygrid-event { filter:brightness(0.95); }

        /* Több esemény + jelzés */
        .fc .fc-daygrid-more-link { font-size:0.6rem; color:#e5e5e5; }
        .light .fc .fc-daygrid-more-link { color:#1f2937; }

        /* Görgetési / fókusz állapot */
        .fc a { transition: color .15s, background .15s; }

        /* Határok finomítása */
        .fc-theme-standard td, .fc-theme-standard th { border-color: var(--fc-border-color); }

        /* Sötét módban finom belső árnyalat a cellákhoz */
        .dark .fc .fc-daygrid-day { box-shadow: inset 0 0 0 1px #111111; }
        .light .fc .fc-daygrid-day { box-shadow: inset 0 0 0 1px #f1f5f9; }
      `}</style>
    </div>
  );
};

export default Calendar;
