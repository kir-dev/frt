export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="h-8 w-48 bg-red-950 animate-pulse rounded"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-red-950 animate-pulse rounded-lg h-40"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
