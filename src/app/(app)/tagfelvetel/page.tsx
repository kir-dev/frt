import RecruitmentPageClient from "./recruitment-page-client"
import { getRecruitmentData } from "@/lib/payload-cms"

export const metadata = {
    title: "Folyamatos tagfelvétel",
    description: "Nyitott pozíciók a csapatunkban",
}

export default async function RecruitmentPage(props: any) {
    // Fetch data on the server
    const recruitmentData = await getRecruitmentData()

    return <RecruitmentPageClient
        recruitmentData={recruitmentData}
        searchParams={props.searchParams}
    />
}
