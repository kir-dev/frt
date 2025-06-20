import {getPayload} from "payload";
import config from "@payload-config";
import {Group, Member, Car, Recruitment, Sponsor} from "@/payload-types";
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

export async function getCars(): Promise<Car[]> {
    const payload = await getPayload({config})
    const cars = await payload.find({
        collection: "cars",
        sort: "-year",
        limit: 1000,
    })

    return cars.docs as Car[]
}

export async function getMembers() : Promise<Member[]> {
    const payload = await getPayload({ config })
    const members = await payload.find({
        collection: "members",
        limit: 1000,
        sort: "order",
    })

    return members.docs as Member[]
}

export async function getGroups() : Promise<Group[]> {
    const payload = await getPayload({ config })
    const groups = await payload.find({
        collection: "groups",
        limit: 1000,
        sort: "order",
    })

    return groups.docs as Group[]
}

export async function getArticles() {
    const payload = await getPayload({ config })
    const articles = await payload.find({
        collection: "articles",
        limit: 1000,
        sort: "-published_date",
    })

    return articles.docs
}

export async function getArticleBySlug(slug: string) {
    const payload = await getPayload({ config })
    const article = await payload.find({
        collection: "articles",
        where: {
            slug: {
                equals: slug,
            },
        },
        limit: 1,
    })

    return article.docs.length > 0 ? article.docs[0] : null
}

export async function getPublications() {
    const payload = await getPayload({ config })
    const publications = await payload.find({
        collection: "publications",
        limit: 1000,
        sort: "-createdAt",
    })

    return publications.docs
}

export async function getAssociation() {
    const payload = await getPayload({ config })
    const association = await payload.find({
        collection: "association",
        limit: 1,
    })

    return association.docs.length > 0 ? association.docs[0] : null
}

