import PageTitle from "@/components/PageTitle";

export default async function DonatePage(props: { searchParams?: Promise<Record<string, string>> }) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    const translations = {
        title: lang === "en" ? "Support Us" : "Támogass Minket",
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center">
            <div className="bg-black flex flex-col items-center px-4 py-12 max-w-5xl">
                {/*<h1 className="text-3xl font-bold mb-12">{translations.title}</h1>*/}
                <PageTitle title={translations.title} className={"text-3xl"} />


            </div>
        </main>
    )
}