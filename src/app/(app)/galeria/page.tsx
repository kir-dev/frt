import type React from "react";
import {getGallery} from "@/lib/payload-cms";
import GalleryCard from "@/components/galleryCard";

export default async function GalleryPage(props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    const translations = {
        title: lang === "en" ? "Gallery" : "Képek",
        noPictures: lang === "en" ? "There are currently no available pictures.": "Jelenleg nincseenek elérhető képek",
    }

    const galleries  = await getGallery();

    if (galleries.length === 0) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <h1 className="text-3xl font-bold text-center mb-12">{translations.title}</h1>
                    <p className="text-center text-xl">{translations.noPictures}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="bg-black container mx-auto py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-12">{translations.title}</h1>
                <div className="bg-black flex flex-col container mx-auto py-12 pb-0 max-w-5xl">
                    <div className="h-0.5 !bg-frtRed w-full mx-auto mb-2"></div>
                    <h2 className="text-xl font-bold">Januar</h2>
                </div>
                {/*Ide jonnek a kepek*/}
                <div className="grid grid-cols-3 gap-4">
                    {galleries.map((gallery, index) => {
                        return (
                            <GalleryCard gallery={gallery} key={index}/>
                        )
                    })}
                </div>
            </div>


        </main>
    )
}