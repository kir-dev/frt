export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="h-10 w-64 bg-red-950 animate-pulse rounded mx-auto mb-12"></div>

                <div className="mb-16">
                    <div className="bg-frtcardBG rounded-lg p-6 mb-8 animate-pulse">
                        <div className="h-8 w-48 bg-red-950 mb-4"></div>
                        <div className="h-4 w-full bg-red-950 mb-2"></div>
                        <div className="h-4 w-3/4 bg-red-950"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-frtcardBG rounded-lg p-6 animate-pulse">
                                <div className="h-6 w-36 bg-red-950 mb-3"></div>
                                <div className="h-4 w-full bg-red-950 mb-2"></div>
                                <div className="h-4 w-5/6 bg-red-950 mb-2"></div>
                                <div className="h-4 w-4/6 bg-red-950"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-16">
                    <div className="bg-frtcardBG rounded-lg p-6 mb-8 animate-pulse">
                        <div className="h-8 w-48 bg-red-950 mb-4"></div>
                        <div className="h-4 w-full bg-red-950 mb-2"></div>
                        <div className="h-4 w-3/4 bg-red-950"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-frtcardBG rounded-lg p-6 animate-pulse">
                                <div className="h-6 w-36 bg-red-950 mb-3"></div>
                                <div className="h-4 w-full bg-red-950 mb-2"></div>
                                <div className="h-4 w-5/6 bg-red-950 mb-2"></div>
                                <div className="h-4 w-4/6 bg-red-950"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
