export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="h-6 w-40 bg-red-950 animate-pulse rounded mb-8"></div>

                <div>
                    <div className="h-4 w-48 bg-red-950 animate-pulse rounded mb-2"></div>
                    <div className="h-10 w-3/4 bg-red-950 animate-pulse rounded mb-6"></div>

                    <div className="aspect-[16/9] bg-red-950 animate-pulse rounded-lg mb-8"></div>

                    <div className="space-y-4 mb-12">
                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                        <div className="h-4 w-3/4 bg-red-950 animate-pulse rounded"></div>
                        <div className="h-4 w-full bg-red-950 animate-pulse rounded"></div>
                        <div className="h-4 w-5/6 bg-red-950 animate-pulse rounded"></div>
                    </div>

                    <div className="h-8 w-48 bg-red-950 animate-pulse rounded mb-4"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="aspect-[4/3] bg-red-950 animate-pulse rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
