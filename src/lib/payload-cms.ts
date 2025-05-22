import {getPayload} from "payload";
import config from "@payload-config";
import {Sponsor} from "@/payload-types";

export async function getSponsors(): Promise<Sponsor[]> {
    const payload = await getPayload({ config })
    const sponsors = await payload.find({
        collection: "sponsors",
    })

    return sponsors.docs as Sponsor[]
}
