import SocialsSection from "@/components/socialsSection";

export default async function ContactPage (props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    const translations = {
        title: lang === "en" ? "Contact Us" : "Lépj velünk kapcsolatba",
        secondTitle: lang === "en" ? "Got a question for the team?" : "Kérdésed lenne a csapatunkhoz? ",
        description: lang === "en" ? "Send us an email by clicking the button below, and our team will get back to you as soon as possible." : "Küldj egy email-t a lenti gomba kattintva, csapatunk pedig válaszol",
        buttonText: lang === "en" ? "Open Email" : "Email Megnyitása",
        socials: lang === "en" ? `Don't forget to Follow Us!` : "Ne felejts el bekövetni minket!",
    }


    return <main className="min-h-screen bg-black text-white flex flex-col items-center">
        <div className="bg-black flex flex-col items-center px-4 py-12 max-w-5xl">
            <h1 className="text-3xl font-bold mb-12">{translations.title}</h1>
            <p className="text-xl">{translations.secondTitle}</p>
            <p className="text-xl">{translations.description}</p>
        </div>
        <div>
            <a className="mb-4 inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base w-full"
                href='mailto:info.bme.frt@gmail.com'
            >
                {translations.buttonText}
            </a>
        </div>
        <div className="mt-12 flex flex-col items-center">
            <p className="text-xl mb-2">{translations.socials}</p>
            <SocialsSection/>
        </div>
    </main>
}