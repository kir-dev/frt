import {sections} from "./pageContent"
import Image from "next/image"
import Link from "next/link";

export default async function DonatePage(props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold mb-8">{lang === "en" ? sections.title_eng : sections.title}</h1>
                <div className="mb-12">
                    <a className="mb-4 max-w-[250px] text-center inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base w-full"
                       href='mailto:sponsoring@fun-ke.com'
                    >
                        {lang === "en" ? "I want to support the team" : "Támogaton a csapatot"}
                    </a>
                </div>
                <h2 className="text-xl font-bold mb-6">{lang === "en" ? sections.subtitle1_eng : sections.subtitle1}</h2>
                <p className="text-xl mb-8">{lang === "en" ? sections.subsections_eng[0] : sections.subsections[0]}{" "}
                    <Link href="/rolunk">
                        <span
                            className="text-lg text-frtRed hover:underline">{lang === "en" ? sections.moreButtonText_eng : sections.moreButtonText}</span>
                    </Link>
                </p>
                <div className="self-center mb-6">
                    <Image src={"/csapatkep.jpg"} alt={"Team picture"} height={300} width={700}
                           className="rounded-xl mx-auto"/>
                </div>
                <div className="flex flex-row justify-center mb-12">
                    <a className="mb-4 max-w-[250px] text-center inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base w-full"
                       href='mailto:sponsoring@fun-ke.com'
                    >
                        {lang === "en" ? "I want to support the team" : "Támogatom a csapatot"}
                    </a>
                </div>
                <h2 className="text-xl font-bold mb-6">{lang === "en" ? sections.subtitle2_eng : sections.subtitle2}</h2>
                <p className="text-xl mb-8">{lang === "en" ? sections.subsections_eng[1] : sections.subsections[1]}
                </p>
                <div className="self-center mb-6">
                    <Image src={"/FRT_FormulaStudent1.jpg"} alt={"Team picture"} height={300} width={700}
                           className="rounded-xl mx-auto"/>
                </div>
                <div className="flex flex-row justify-center mb-12">
                    <a className="mb-4 max-w-[250px] text-center inline-block bg-red-600 hover:bg-red-700 !text-white font-bold py-2 px-6 rounded-lg transition-colors text-base w-full"
                       href='mailto:sponsoring@fun-ke.com'
                    >
                        {lang === "en" ? "I want to support the team" : "Támogatom a csapatot"}
                    </a>
                </div>
            </div>
            {/*<p className="text-xl">{lang === "en" ? sections.subtitle_eng : sections.subtitle}</p>*/}
        </main>
    )
}