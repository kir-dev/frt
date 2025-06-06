import {getPayload} from "payload";
import config from "@payload-config";
import {Group, Member, Recruitment, Sponsor} from "@/payload-types";

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

export async function getMembers() : Promise<Member[]> {
    console.log("Fetching members from Payload CMS...")
    const payload = await getPayload({ config })
    const members = await payload.find({
        collection: "members",
        limit: 1000,
        sort: "order",
    })

    return members.docs as Member[]
}

export async function getGroups() : Promise<Group[]> {
    console.log("Fetching groups from Payload CMS...")
    const payload = await getPayload({ config })
    const groups = await payload.find({
        collection: "groups",
        limit: 1000,
        sort: "order",
    })

    return groups.docs as Group[]
}
