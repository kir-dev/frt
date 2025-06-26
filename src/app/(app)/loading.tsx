import Image from "next/image"

export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Team photo loading skeleton */}
            <div className="w-full relative">
                <div className="w-full max-h-[600px] overflow-hidden">
                    <Image
                        src="/csapatkep.jpg"
                        alt="Csapatkép"
                        width={1920}
                        height={600}
                        className=" w-full h-auto object-cover max-h-[600px] opacity-60 blur-sm select-none pointer-events-none"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    </div>
                </div>
            </div>
            {/* Main loading content with navbar height offset */}
            <div className="pt-16">
                {/* "Kik vagyunk mi?" section loading */}
                <section className="relative">
                    <div className="container mx-auto px-4 py-16 max-w-5xl">
                        <div className="h-10 w-64 bg-red-950 animate-pulse rounded mb-8"></div>
                        <div className="space-y-4 max-w-3xl">
                            <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                            <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                            <div className="h-4 w-3/4 bg-red-950 animate-pulse rounded"></div>
                            <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                            <div className="h-4 w-5/6 bg-red-950 animate-pulse rounded"></div>
                        </div>
                    </div>
                </section>

                {/* Social Media Posts section loading */}
                <section className="py-16 bg-frtcardBG">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="h-8 w-64 bg-red-950 animate-pulse rounded mb-8"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <div key={index} className="bg-frtcardBG rounded-lg overflow-hidden">
                                    <div className="aspect-square bg-red-950 animate-pulse"></div>
                                    <div className="p-4">
                                        <div className="h-4 w-3/4 bg-red-950 animate-pulse rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-red-950 animate-pulse rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Latest News Article section loading */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="h-8 w-64 bg-red-950 animate-pulse rounded mb-8"></div>
                        <div className="bg-frtcardBG rounded-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    <div className="aspect-[16/9] bg-red-950 animate-pulse"></div>
                                </div>
                                <div className="p-6 md:w-1/2">
                                    <div className="h-4 w-48 bg-red-950 animate-pulse rounded mb-4"></div>
                                    <div className="h-8 w-3/4 bg-red-950 animate-pulse rounded mb-4"></div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                                        <div className="h-4 w-2/3 bg-red-950 animate-pulse rounded"></div>
                                    </div>
                                    <div className="h-4 w-32 bg-red-950 animate-pulse rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <div className="h-10 w-48 bg-red-950 animate-pulse rounded"></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
