export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="h-10 w-64 bg-red-950 animate-pulse rounded mb-4"></div>
                <div className="h-6 w-96 bg-red-950 animate-pulse rounded mb-12"></div>

                <div className="space-y-8">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="bg-frtcardBG rounded-lg p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-red-950 animate-pulse rounded mb-3"></div>
                                    <div className="h-6 w-3/4 bg-red-950 animate-pulse rounded mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                                        <div className="h-4 w-2/3 bg-red-950 animate-pulse rounded"></div>
                                    </div>
                                </div>
                                <div className="lg:w-auto">
                                    <div className="h-8 w-24 bg-red-950 animate-pulse rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-frtcardBG rounded-lg p-6">
                    <div className="h-6 w-48 bg-red-950 animate-pulse rounded mb-3"></div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                        <div className="h-4 w-3/4 bg-red-950 animate-pulse rounded"></div>
                    </div>
                    <div className="h-8 w-32 bg-red-950 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    )
}
