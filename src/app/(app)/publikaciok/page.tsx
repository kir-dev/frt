import Link from "next/link"
import { getPublications } from "@/lib/payload-cms"
import { ExternalLink, User, FileText } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

// Új típus a searchParams-hoz
export type PublicationsPageProps = {
    searchParams?: Promise<Record<string, string>>;
}

export const metadata = {
    title: "Publikációk",
    description: "Csapattagjaink kutatási munkái és szakdolgozatai",
}

export default async function PublicationsPage(props: PublicationsPageProps) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }
    const publications = await getPublications()

    if (publications.length === 0) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold mb-12">{lang === 'en' ? 'Publications' : 'Publikációk'}</h1>
                    <div className="bg-frtcardBG rounded-lg p-8 text-center">
                        <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-xl text-gray-400">{lang === 'en' ? 'There are currently no available publications.' : 'Jelenleg nincsenek elérhető publikációk.'}</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-4">{lang === 'en' ? 'Publications' : 'Publikációk'}</h1>
                <p className="text-gray-400 mb-12 text-lg">
                    {lang === 'en'
                        ? 'Research works, theses, and other publications by our team members'
                        : 'Csapattagjaink kutatási munkái, szakdolgozatai és egyéb publikációi'}
                </p>

                <div className="space-y-8">
                    {publications.map((publication) => (
                        <article key={publication.id} className="bg-frtcardBG rounded-lg p-6 hover:bg-red-950 transition-colors">
                            <div className="flex flex-col gap-4">
                                <div className="relative w-full">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <User size={16} />
                                            <span>{publication.author}</span>
                                        </div>
                                        <Link
                                            href={publication.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-block"
                                        >
                                            <h2 className="text-xl font-bold group-hover:text-frtRed transition-colors flex items-center gap-2">
                                                {lang === 'en' ? publication.title_eng : publication.title}
                                            </h2>
                                        </Link>
                                        <div className="mt-2 sm:mt-0 sm:absolute sm:top-0 sm:right-0 w-fit">
                                            <Link
                                                href={publication.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-2 sm:px-2 sm:py-1 !bg-frtRed !hover:bg-red-800 !text-white rounded-md transition-colors text-xs font-medium"
                                            >
                                                <ExternalLink size={14} />
                                                {lang === 'en' ? 'View' : 'Megtekintés'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="rich-text-content w-full">
                                    <RichText data={lang === 'en' ? publication.description_eng : publication.description} />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    )
}
