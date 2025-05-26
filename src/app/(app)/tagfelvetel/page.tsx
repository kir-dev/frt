import RecruitmentPageClient from "./recruitment-page-client"
import { getRecruitmentData } from "@/lib/payload-cms"

export const metadata = {
    title: "Folyamatos tagfelvétel",
    description: "Nyitott pozíciók a csapatunkban",
}

export default async function RecruitmentPage(props: any) {
    // Nyelvi paraméter kezelése
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = typeof props.searchParams.then === 'function' ? await props.searchParams : props.searchParams;
        lang = sp?.lang === 'en' ? 'en' : 'hu';
    }

    // Fetch data on the server
    const recruitmentData = await getRecruitmentData()

    return <RecruitmentPageClient
        recruitmentData={recruitmentData}
        lang={lang}
    />
}
