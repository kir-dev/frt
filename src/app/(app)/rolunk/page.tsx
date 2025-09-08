import Image from "next/image"
import { getGroups, getMembers } from "@/lib/payload-cms"
import type { Group, Member } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"


export const metadata = {
    title: "Rólunk",
    description: "Ismerje meg csapatunkat",
}

// Új típus a searchParams-hoz
export type AboutUsPageProps = {
    searchParams?: Promise<Record<string, string>>;
}

export default async function AboutUsPage(props: AboutUsPageProps) {
    let lang = 'hu';
    if (props?.searchParams) {
        const sp = await props.searchParams;
        lang = sp && 'lang' in sp && sp.lang === 'en' ? 'en' : 'hu';
    }
    const groups = await getGroups()
    const members = await getMembers()

    // Group members by their group
    const membersByGroup: Record<string, Member[]> = {}

    members.forEach((member) => {
        // Ha a member.group egy objektum (Payload relationship populated), akkor az id-t használjuk kulcsként
        const key = typeof member.group === "object" && member.group !== null ? String(member.group.id) : String(member.group)
        if (!membersByGroup[key]) {
            membersByGroup[key] = []
        }
        membersByGroup[key].push(member)
    })

    return (
        <main className="min-h-screen bg-black text-white">
            {groups.map((group: Group, index: number) => {
                const groupMembers = membersByGroup[String(group.id)] || []

                return (
                    <section key={group.id} className="relative">
                        {/* Red line at the top, de csak ha nem az első group */}
                        {index !== 0 && (
                            <div className="border-t-1 border-red-600 max-w-5xl mx-auto"></div>
                        )}
                        <div className="container mx-auto px-4 py-16 max-w-5xl">
                            {/* Group title - left aligned */}
                            <h2 className="text-4xl font-bold mb-8 text-left">{lang === 'en' ? group.nameEn : group.name}</h2>

                            {/* Group description - left aligned */}
                            <div className="rich-text-content text-left max-w-5xl">
                                <RichText data={lang === 'en' ? group.descriptionEng : group.description} />
                            </div>

                            {/* Member photos in a horizontal row */}
                            <div className="flex flex-wrap justify-start gap-4">
                                {groupMembers.map((member) => (
                                    <div key={member.id} className="relative group">
                                        <div className="w-80 h-96 overflow-hidden bg-frtcardBG relative">
                                            {member.linkedin ? (
                                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                                                    <div className="absolute top-2 right-2 z-40" style={{pointerEvents: 'none'}}>
                                                        <span className="!bg-black rounded-full p-1 shadow-lg flex items-center justify-center" style={{width: '32px', height: '32px'}}>
                                                            <Image src="/linkedin.png" alt="LinkedIn" width={25} height={25} className="inline-block" />
                                                        </span>
                                                    </div>
                                                    <Image
                                                        src={typeof member.picture === 'object' && member.picture !== null && 'url' in member.picture && member.picture.url ? member.picture.url : "/placeholder.svg"}
                                                        alt={member.name}
                                                        width={320}
                                                        height={384}
                                                        className="object-cover w-full h-full cursor-pointer"
                                                    />
                                                </a>
                                            ) : (
                                                <Image
                                                    src={typeof member.picture === 'object' && member.picture !== null && 'url' in member.picture && member.picture.url ? member.picture.url : "/placeholder.svg"}
                                                    alt={member.name}
                                                    width={320}
                                                    height={384}
                                                    className="object-cover w-full h-full"
                                                />
                                            )}
                                            {/* Name and position overlay */}
                                            <div className="absolute bottom-0 left-0 mb-4 ml-4 px-4 py-2 rounded bg-black/80 backdrop-blur-sm max-w-[90%]">
                                                <h3 className="font-bold text-lg !text-white">{member.name}</h3>
                                                {member.position && <p className="!text-gray-300 text-sm">{lang === 'en' && member.positionEn ? member.positionEn : member.position}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            })}
        </main>
    )
}
