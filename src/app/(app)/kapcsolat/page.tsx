import SocialsSection from "@/components/socialsSection";
import { getContact } from "@/lib/payload-cms";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default async function ContactPage (props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    const contact = await getContact();

    if (!contact) {
        const translations = {
            title: lang === "en" ? "Contact Us" : "Lépj velünk kapcsolatba",
            description: lang === "en" ? "Send us an email by clicking the button below, and our team will get back to you as soon as possible." : "Küldj egy email-t a lenti gombra kattintva, csapatunk pedig hamarosan válaszol.",
            buttonText: lang === "en" ? "Open Email" : "Email megnyitása",
            socials: lang === "en" ? `Don't forget to Follow Us!` : "Ne felejts el bekövetni minket!",
        };

        return (
            <main className="min-h-screen bg-black text-white flex flex-col items-center">
                <div className="bg-black flex flex-col items-center px-4 py-12 max-w-5xl text-center">
                    <h1 className="text-3xl font-bold mb-6">{translations.title}</h1>
                    <p className="text-xl mb-6">{translations.description}</p>
                    <a className="mb-4 inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base"
                       href='mailto:info.bme.frt@gmail.com'>
                        {translations.buttonText}
                    </a>
                </div>
                <div className="mt-12 flex flex-col items-center">
                    <p className="text-xl mb-2">{translations.socials}</p>
                    <SocialsSection/>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center">
            <div className="bg-black flex flex-col items-center px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-8 text-center">{lang === 'en' ? contact.title_en : contact.title}</h1>
                <div className="rich-text-content font-frtszoveg max-w-3xl">
                    <RichText data={lang === 'en' ? contact.content_en : contact.content} />
                </div>
                <div className="mt-8">
                    <a className="mb-4 inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base"
                       href='mailto:info.bme.frt@gmail.com'>
                        {lang === 'en' ? 'Open Email' : 'Email megnyitása'}
                    </a>
                </div>
            </div>
            <div className="mt-12 flex flex-col items-center">
                <p className="text-xl mb-2">{lang === 'en' ? `Don't forget to Follow Us!` : 'Ne felejts el bekövetni minket!'}</p>
                <SocialsSection/>
            </div>
        </main>
    )
}