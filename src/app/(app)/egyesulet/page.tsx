import { getAssociation } from "@/lib/payload-cms"
import { Building2, Mail, MapPin } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

export const metadata = {
    title: "Egyesület",
    description: "A BME Formula Racing Team Egyesület bemutatása",
}

export default async function AssociationPage() {
    const association = await getAssociation()

    if (!association) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <div className="bg-frtcardBG rounded-lg p-8 text-center">
                        <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
                        <h1 className="text-2xl font-bold mb-4">Egyesület információ nem elérhető</h1>
                        <p className="text-gray-400">Az egyesület adatai jelenleg nem tölthetők be.</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-4xl font-bold">{association.title}</h1>
                </div>

                <div className="prose prose-invert max-w-none">
                    <RichText data={association.content} />
                </div>

                <div className="mt-12 bg-frtcardBG rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Kapcsolatfelvétel
                    </h3>
                    <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-gray-400" />
                            <a href="mailto:info@bmeformularacing.hu" className="hover:text-frtRed transition-colors">
                                info@bmeformularacing.hu
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-gray-400" />
                            <span>1111 Budapest, Műegyetem rkp. 3.</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-frtcardBG rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Támogatás</h3>
                    <p className="text-gray-300 mb-4">
                        Ha szeretné támogatni az egyesület munkáját és a csapat tevékenységét, kérjük, vegye fel velünk a
                        kapcsolatot. Minden támogatást nagyra értékelünk!
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="mailto:info@bmeformularacing.hu?subject=Támogatás"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-frtRed hover:bg-red-800 text-white rounded-lg transition-colors"
                        >
                            <Mail size={16} />
                            Kapcsolatfelvétel
                        </a>
                        <a
                            href="/tamogatok"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            <Building2 size={16} />
                            Jelenlegi támogatók
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}

