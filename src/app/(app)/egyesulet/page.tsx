import { getAssociation } from "@/lib/payload-cms"
import { Building2 } from "lucide-react"
import {RichText} from "@payloadcms/richtext-lexical/react";

export const metadata = {
    title: "Egyesület",
    description: "A BME Formula Racing Team Egyesület bemutatása",
}

interface AssociationPageProps {
    searchParams?: Promise<Record<string, string>>;
}

export default async function AssociationPage(props: AssociationPageProps) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    let sp: Record<string, string> | undefined = undefined;
    if (props?.searchParams) {
        sp = await props.searchParams;
        if (sp && typeof sp.lang === 'string' && sp.lang === 'en') {
            lang = 'en';
        }
    }

    const translations = {
        title: lang === 'en' ? 'Association' : 'Egyesület',
        notAvailable: lang === 'en' ? 'Association information not available' : 'Egyesület információ nem elérhető',
        notAvailableDesc: lang === 'en' ? "The association's data cannot be loaded at the moment." : 'Az egyesület adatai jelenleg nem tölthetők be.',
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
        <main className="min-h-screen bg-black text-white font-frtszoveg">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-4xl font-bold">{lang === 'en' ? association.title_en : association.title}</h1>
                </div>

                <div className="rich-text-content">
                    <RichText data={lang === 'en' ? association.content_en : association.content} />
                </div>
            </div>
        </main>
    )
}
