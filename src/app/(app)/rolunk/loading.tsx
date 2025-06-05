export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="h-10 w-48 bg-gray-800 animate-pulse rounded mx-auto mb-12"></div>

                {[1, 2].map((groupIndex) => (
                    <div key={groupIndex} className="mb-20">
                        <div className="border-t border-red-600 mb-8"></div>

                        <div className="h-8 w-64 bg-gray-800 animate-pulse rounded mb-6"></div>

                        <div className="mb-8">
                            <div className="h-4 w-full bg-gray-800 animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-5/6 bg-gray-800 animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-4/6 bg-gray-800 animate-pulse rounded"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((memberIndex) => (
                                <div key={memberIndex} className="aspect-[4/5] bg-gray-800 animate-pulse rounded relative">
                                    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 p-3">
                                        <div className="h-5 w-32 bg-gray-800 animate-pulse rounded mb-1"></div>
                                        <div className="h-4 w-24 bg-gray-800 animate-pulse rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
