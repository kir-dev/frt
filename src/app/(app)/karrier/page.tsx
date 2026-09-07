import { getCareerSettings, getRecruitmentData } from "@/lib/payload-cms";
import CareerPageClient from "./career-page-client";

export const metadata = {
    title: "Karrier",
    description: "Csatlakozz a csapatunkhoz — csoportjaink és nyitott pozícióink",
}

type CareerPageProps = {
    searchParams?: Promise<Record<string, string>>;
}

export default async function CareerPage(props: CareerPageProps) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    // Fetch data on the server
    const [recruitmentData, careerSettings] = await Promise.all([
        getRecruitmentData(),
        getCareerSettings(),
    ])

    return <CareerPageClient
        recruitmentData={recruitmentData}
        careerSettings={careerSettings}
        lang={lang}
    />
}
