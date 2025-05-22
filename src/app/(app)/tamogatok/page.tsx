import Image from "next/image"
import Link from "next/link"
import { getSponsors } from "@/lib/payload-cms"
import {Sponsor} from "@/payload-types";

export const metadata = {
    title: "Támogatók",
    description: "Támogatóink listája",
}

// Use searchParams in the server component
export default async function SponsorsPage(props: any) {
    // Await searchParams if it's a promise (Next.js 14+)
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = typeof props.searchParams.then === 'function' ? await props.searchParams : props.searchParams;
        lang = sp?.lang === 'en' ? 'en' : 'hu';
    }
    const sponsors = await getSponsors()

    // Group sponsors by tier
    const sponsorsByTier = sponsors.reduce(
        (acc, sponsor) => {
            const tier = sponsor.tier || "other"
            if (!acc[tier]) {
                acc[tier] = []
            }
            acc[tier].push(sponsor)
            return acc
        },
        {} as Record<string, Sponsor[]>,
    )

    // Define tier order and translations
    const tierOrder = ["diamond", "gold", "silver", "copper", "other", "bme"]
    const tierTranslations = {
        diamond: lang === 'en' ? "Diamond tier Sponsors" : "Gyémánt fokozatú támogatóink",
        gold: lang === 'en' ? "Gold tier Sponsors" : "Arany fokozatú támogatóink",
        silver: lang === 'en' ? "Silver tier Sponsors" : "Ezüst fokozatú támogatóink",
        copper: lang === 'en' ? "Bronze tier Sponsors" : "Bronz fokozatú támogatóink",
        bme: lang === 'en' ? "Budapest University of Technology and Economics" : "Budapesti Műszaki és Gazdaságtudományi Egyetem",
        other: lang === 'en' ? "Other Sponsors" : "További támogatóink",
    }

    // Sort tiers by predefined order
    const sortedTiers = Object.keys(sponsorsByTier).sort((a, b) => tierOrder.indexOf(a) - tierOrder.indexOf(b))

    return (
        <main className="bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-7xl">

                {sortedTiers.map((tier) => (
                    <section key={tier} className="mb-16">
                        <h2 className="text-3xl mb-8 text-left">
                            {tierTranslations[tier as keyof typeof tierTranslations] || tier}
                        </h2>

                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6${["copper", "other", "bme"].includes(tier) ? " md:grid-cols-3 lg:grid-cols-6" : ""}${tier === "silver" ? " md:grid-cols-3 lg:grid-cols-4" : ""}`}>
                            {sponsorsByTier[tier].map((sponsor) => {
                                let logoUrl = "/placeholder.svg";
                                if (sponsor.logo && typeof sponsor.logo === "object" && "url" in sponsor.logo) {
                                    logoUrl = sponsor.logo.url as string;
                                }
                                // Make the last three tiers' cards narrower, and silver a bit narrower
                                const isNarrow = ["copper", "other", "bme"].includes(tier);
                                const isSilver = tier === "silver";
                                return (
                                    <div key={sponsor.id} className={`bg-white rounded-lg p-4 flex items-center justify-center h-40${isNarrow ? " max-w-full" : isSilver ? " max-w-full " : ""}`}>
                                        {sponsor.website ? (
                                            <Link
                                                href={sponsor.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full h-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                                aria-label={`Visit ${sponsor.name} website`}
                                            >
                                                <Image
                                                    src={logoUrl}
                                                    alt={sponsor.name}
                                                    width={200}
                                                    height={100}
                                                    className="max-h-32 w-auto object-contain"
                                                    priority={tier === "diamond" || tier === "gold"}
                                                />
                                            </Link>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image
                                                    src={logoUrl}
                                                    alt={sponsor.name}
                                                    width={200}
                                                    height={100}
                                                    className="max-h-28 w-auto object-contain"
                                                    priority={tier === "diamond" || tier === "gold"}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {tier !== sortedTiers[sortedTiers.length - 1] && (
                            <div className="border-t border-frtRed my-12 mx-auto max-w-7xl"></div>
                        )}
                    </section>
                ))}
            </div>
        </main>
    )
}

