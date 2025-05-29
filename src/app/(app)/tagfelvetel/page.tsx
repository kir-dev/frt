import RecruitmentPageClient from "./recruitment-page-client"
import { getRecruitmentData } from "@/lib/payload-cms"

export const metadata = {
    title: "Folyamatos tagfelvétel",
    description: "Nyitott pozíciók a csapatunkban",
}

type RecruitmentPageProps = {
    searchParams?: Promise<Record<string, string>>;
}

export default async function RecruitmentPage(props: RecruitmentPageProps) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }

    // Fetch data on the server
    const recruitmentData = await getRecruitmentData()

    return <RecruitmentPageClient
        recruitmentData={recruitmentData}
        lang={lang}
    />
}
