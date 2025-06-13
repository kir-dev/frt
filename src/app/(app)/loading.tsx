export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* "Kik vagyunk mi?" section loading */}
            <section className="relative">
                <div className="container mx-auto px-4 py-16 max-w-5xl">
                    <div className="h-10 w-64 bg-gray-800 animate-pulse rounded mb-8"></div>
                    <div className="space-y-4 max-w-3xl">
                        <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-800 animate-pulse rounded"></div>
                    </div>
                </div>
            </section>

            {/* Social Media Posts section loading */}
            <section className="py-16 bg-gray-950">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="h-8 w-64 bg-gray-800 animate-pulse rounded mb-8"></div>
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
                </div>
            </section>

            {/* Latest News Article section loading */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="h-8 w-64 bg-gray-800 animate-pulse rounded mb-8"></div>
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2">
                                <div className="aspect-[16/9] bg-gray-800 animate-pulse"></div>
                            </div>
                            <div className="p-6 md:w-1/2">
                                <div className="h-4 w-48 bg-gray-800 animate-pulse rounded mb-4"></div>
                                <div className="h-8 w-3/4 bg-gray-800 animate-pulse rounded mb-4"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                                    <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                                    <div className="h-4 w-2/3 bg-gray-800 animate-pulse rounded"></div>
                                </div>
                                <div className="h-4 w-32 bg-gray-800 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <div className="h-10 w-48 bg-gray-800 animate-pulse rounded"></div>
                    </div>
                </div>
            </section>
        </div>
    )
}
