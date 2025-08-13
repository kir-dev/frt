import { RichText } from "@payloadcms/richtext-lexical/react";
import { getEventBySlug } from "@/lib/payload-cms";
import { notFound } from "next/navigation";

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
    <main className="min-h-screen bg-black text-white">
      <div className="bg-black container mx-auto py-12 max-w-5xl">
        <div className="prose prose-invert max-w-none text-white">
          <RichText
            data={lang === "en" ? event.description_eng : event.description}
          />
        </div>
      </div>
    </main>
  );
}
