export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="h-10 w-64 bg-red-950 animate-pulse rounded mx-auto mb-6"></div>
                <div className="h-4 w-full max-w-2xl bg-red-950 animate-pulse rounded mx-auto mb-2"></div>
                <div className="h-4 w-2/3 max-w-xl bg-red-950 animate-pulse rounded mx-auto mb-12"></div>

                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-frtcardBG rounded-lg overflow-hidden animate-pulse">
                            <div className="flex flex-col sm:flex-row">
                                <div className="h-44 w-full sm:h-40 sm:w-56 bg-red-950 shrink-0"></div>
                                <div className="flex-1 px-5 py-5">
                                    <div className="h-7 w-48 bg-red-950 mb-4 rounded"></div>
                                    <div className="h-4 w-full bg-red-950 mb-2 rounded"></div>
                                    <div className="h-4 w-3/4 bg-red-950 mb-4 rounded"></div>
                                    <div className="h-3 w-32 bg-red-950 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
