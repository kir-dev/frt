import { getSupportUs } from "@/lib/payload-cms";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default async function DonatePage(props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    const support = await getSupportUs();

    if (!support) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="bg-black container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold mb-8">{lang === 'en' ? 'Support our Team' : 'Támogasd Csapatunkat'}</h1>
                    <div className="bg-frtcardBG rounded-lg p-8 text-center">
                        <p className="text-gray-400">{lang === 'en' ? 'Support page content is not available right now.' : 'A támogatási oldal tartalma jelenleg nem érhető el.'}</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="bg-black container mx-auto px-4 py-12 max-w-5xl font-frtszoveg">
                <h1 className="text-3xl font-bold mb-8">{lang === "en" ? support.title_en : support.title}</h1>
                <div className="mb-8">
                    <a
                        className="mb-4 max-w-[300px] text-center inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base w-full"
                        href='mailto:sponsoring@fun-ke.com'
                    >
                        {lang === "en" ? support.button_text_en : support.button_text}
                    </a>
                </div>
                <div className="rich-text-content">
                    <RichText data={lang === 'en' ? support.content_en : support.content} />
                </div>
            </div>
        </main>
    )
}