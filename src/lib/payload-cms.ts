import {getPayload} from "payload";
import config from "@payload-config";
import {Recruitment, Sponsor} from "@/payload-types";

export async function getSponsors(): Promise<Sponsor[]> {
    const payload = await getPayload({ config })
    const sponsors = await payload.find({
        collection: "sponsors",
        limit: 1000,
    })

    return sponsors.docs as Sponsor[]
}

export async function getRecruitmentData() : Promise<Recruitment[]> {
    const payload = await getPayload({ config })
    const recruitmentData = await payload.find({
        collection: "recruitment",
        limit: 1000,
    })
    return recruitmentData.docs
}
