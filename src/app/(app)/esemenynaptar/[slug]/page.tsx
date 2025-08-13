import { RichText } from "@payloadcms/richtext-lexical/react";
import { getEventBySlug } from "@/lib/payload-cms";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
        <h1 className="text-4xl font-bold mb-12">
          {lang === "en" ? event.title_eng : event.title}
        </h1>
        {event.facebookEventLink && (
          <>
            <h2 className="text-2xl font-bold">
              {lang === "en" ? "Facebook event: " : "Facebook esemény: "}
            </h2>
            <Link href={event.facebookEventLink}></Link>
          </>
        )}
        <div className="prose prose-invert max-w-none text-white">
          <RichText
            data={lang === "en" ? event.description_eng : event.description}
          />
        </div>
      </div>
    </main>
  );
}
