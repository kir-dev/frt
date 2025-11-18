import { getFormulaStudent } from "@/lib/payload-cms";
import { RichText } from "@payloadcms/richtext-lexical/react";

export const metadata = {
    title: "Formula Student",
    description: "A Formula Student versenysorozat bemutatása",
}

interface FormulaStudentPageProps {
    searchParams?: Promise<Record<string, string>>;
}

export default async function FormulaStudentPage(props: FormulaStudentPageProps) {
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
        title: lang === 'en' ? 'Formula Student' : 'Formula Student',
        notAvailable: lang === 'en' ? 'Formula Student information not available' : 'Formula Student információ nem elérhető',
        notAvailableDesc: lang === 'en' ? "The Formula Student page data cannot be loaded at the moment." : 'A Formula Student oldal adatai jelenleg nem tölthetők be.',
    };

    const formulaStudent = await getFormulaStudent();

    if (!formulaStudent) {
        return (
            <main className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <div className="bg-frtcardBG rounded-lg p-8 text-center">
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
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                    {lang === 'en' ? formulaStudent.title_en : formulaStudent.title}
                </h1>
                
                <div className="prose prose-invert prose-lg max-w-none">
                    <RichText data={lang === 'en' ? formulaStudent.content_en : formulaStudent.content} />
                </div>
            </div>
        </main>
    )
}   