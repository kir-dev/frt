import Image from "next/image"
import { getGroups, getMembers } from "@/lib/payload-cms"
import type { Group, Member } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"


export const metadata = {
    title: "Rólunk",
    description: "Ismerje meg csapatunkat",
}

// Next.js cache letiltása ezen az oldalon
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type AboutUsPageProps = {
    searchParams?: Promise<Record<string, string>>;
}

export default async function AboutUsPage(props: AboutUsPageProps) {
    // Await searchParams to force dynamic rendering
    if (props?.searchParams) {
        await props.searchParams;
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
                            <h2 className="text-4xl font-bold mb-8 text-left">{group.name}</h2>

                            {/* Group description - left aligned */}
                            <div className="text-gray-300 text-left max-w-5xl">
                                <RichText data={group.description} />
                            </div>

                            {/* Member photos in a horizontal row */}
                            <div className="flex flex-wrap justify-start gap-4">
                                {groupMembers.map((member) => (
                                    <div key={member.id} className="relative group">
                                        <div className="w-80 h-96 overflow-hidden bg-gray-900 relative">
                                            <Image
                                                src={typeof member.picture === 'object' && member.picture.url ? member.picture.url : "/placeholder.svg"}
                                                alt={member.name}
                                                width={320}
                                                height={384}
                                                className="object-cover w-full h-full"
                                            />
                                            {/* Name and position overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4">
                                                <h3 className="font-bold text-lg text-white">{member.name}</h3>
                                                {member.position && <p className="text-gray-300 text-sm">{member.position}</p>}
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
