import { getAssociation } from "@/lib/payload-cms"
import { Building2, Mail, MapPin } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

export const metadata = {
    title: "Egyesület",
    description: "A BME Formula Racing Team Egyesület bemutatása",
}

interface AssociationPageProps {
    searchParams?: Record<string, string>;
}

export default async function AssociationPage(props: AssociationPageProps) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    if (props?.searchParams && typeof props.searchParams.lang === 'string' && props.searchParams.lang === 'en') {
        lang = 'en';
    }

    const translations = {
        title: lang === 'en' ? 'Association' : 'Egyesület',
        notAvailable: lang === 'en' ? 'Association information not available' : 'Egyesület információ nem elérhető',
        notAvailableDesc: lang === 'en' ? "The association's data cannot be loaded at the moment." : 'Az egyesület adatai jelenleg nem tölthetők be.',
        contact: lang === 'en' ? 'Contact' : 'Kapcsolatfelvétel',
        address: '1111 Budapest, Műegyetem rkp. 3.',
        support: lang === 'en' ? 'Support' : 'Támogatás',
        supportDesc: lang === 'en'
            ? "If you would like to support the association's work and the team's activities, please contact us. We appreciate all support!"
            : "Ha szeretné támogatni az egyesület munkáját és a csapat tevékenységét, kérjük, vegye fel velünk a kapcsolatot. Minden támogatást nagyra értékelünk!",
        contactButton: lang === 'en' ? 'Contact' : 'Kapcsolatfelvétel',
        supportersButton: lang === 'en' ? 'Current supporters' : 'Jelenlegi támogatók',
    };

    const association = await getAssociation();

    if (!association) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <div className="bg-frtcardBG rounded-lg p-8 text-center">
                        <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
                        <h1 className="text-2xl font-bold mb-4">{translations.notAvailable}</h1>
                        <p className="text-gray-400">{translations.notAvailableDesc}</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-4xl font-bold">{lang === 'en' ? association.title_en : association.title}</h1>
                </div>

                <div className="prose prose-invert max-w-none">
                    <RichText data={lang === 'en' ? association.content_en : association.content} />
                </div>

                <div className="mt-12 bg-frtcardBG rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        {translations.contact}
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
                            <span>{translations.address}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-frtcardBG rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">{translations.support}</h3>
                    <p className="text-gray-300 mb-4">
                        {translations.supportDesc}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href={`mailto:info@bmeformularacing.hu?subject=${encodeURIComponent(translations.support)}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-frtRed hover:bg-red-800 text-white rounded-lg transition-colors"
                        >
                            <Mail size={16} />
                            {translations.contactButton}
                        </a>
                        <a
                            href="/tamogatok"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            <Building2 size={16} />
                            {translations.supportersButton}
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}
