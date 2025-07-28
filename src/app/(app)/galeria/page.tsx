import type React from "react";

export default async function GalleryPage(props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    const translations = {
        title: lang === "en" ? "Gallery" : "Képek",
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="bg-black container mx-auto py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-12">{translations.title}</h1>
            </div>
            <div className="bg-black flex flex-col container mx-auto py-12 pb-0 max-w-5xl">
                <div className="h-0.5 !bg-frtRed w-full mx-auto mb-2"></div>
                <h2 className="text-xl font-bold">Januar</h2>
            </div>
            {/*Ide jonnek a kepek*/}

        </main>
    )
}