import { getAllSocialPosts } from "@/lib/social-api"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function SocialFeed() {
    let posts: Awaited<ReturnType<typeof getAllSocialPosts>> = [];
    let error = false;
    try {
        posts = await getAllSocialPosts();
    } catch (e) {
        error = true;
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <p className="text-frtRed">Hiba történt a social media posztok betöltésekor.</p>
            </div>
        )
    }

    if (!posts.length) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-800 animate-pulse"></div>
                        <div className="p-4">
                            <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-800 animate-pulse rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-[#230505] rounded-lg overflow-hidden shadow-md flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                >
                    <Link
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="relative w-full aspect-square">
                            <Image
                                src={post.imageUrl}
                                alt={post.caption}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                unoptimized={post.platform === "youtube"}
                            />
                        </div>
                    </Link>
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center mb-2 gap-2">
                            {post.platform === "instagram" && (
                                <Instagram className="w-5 h-5 text-pink-500" />
                            )}
                            {post.platform === "facebook" && (
                                <Facebook className="w-5 h-5 text-blue-600" />
                            )}
                            {post.platform === "twitter" && (
                                <Twitter className="w-5 h-5 text-sky-400" />
                            )}
                            {post.platform === "youtube" && (
                                <Youtube className="w-5 h-5 text-frtRed" />
                            )}
                            <span className="text-xs text-gray-400">
                                {formatDate(post.date)}
                            </span>
                        </div>
                        <p className="text-gray-200 text-sm flex-1">
                            {post.caption}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
