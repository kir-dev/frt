import Link from "next/link"
import { getPublications } from "@/lib/payload-cms"
import { ExternalLink, User, FileText } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

export const metadata = {
    title: "Publikációk",
    description: "Csapattagjaink kutatási munkái és szakdolgozatai",
}

export default async function PublicationsPage() {
    const publications = await getPublications()

    if (publications.length === 0) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold mb-12">Publikációk</h1>
                    <div className="bg-frtcardBG rounded-lg p-8 text-center">
                        <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-xl text-gray-400">Jelenleg nincsenek elérhető publikációk.</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-4">Publikációk</h1>
                <p className="text-gray-400 mb-12 text-lg">
                    Csapattagjaink kutatási munkái, szakdolgozatai és egyéb publikációi
                </p>

                <div className="space-y-8">
                    {publications.map((publication) => (
                        <article key={publication.id} className="bg-frtcardBG rounded-lg p-6 hover:bg-red-950 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                        <User size={16} />
                                        <span>{publication.author}</span>
                                    </div>

                                    <Link
                                        href={publication.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-block"
                                    >
                                        <h2 className="text-xl font-bold mb-4 group-hover:text-frtRed transition-colors flex items-center gap-2">
                                            {publication.title}
                                            <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h2>
                                    </Link>

                                    <div className="text-gray-300 prose prose-invert max-w-none">
                                        <RichText data={publication.description} />
                                    </div>
                                </div>

                                <div className="lg:w-auto">
                                    <Link
                                        href={publication.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-frtRed hover:bg-red-800 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <ExternalLink size={16} />
                                        Megtekintés
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    )
}
