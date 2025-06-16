export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="h-10 w-48 bg-red-950 animate-pulse rounded mb-12"></div>

                <div className="space-y-12">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="bg-frtcardBG rounded-lg overflow-hidden">
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
                    ))}
                </div>
            </div>
        </div>
    )
}
