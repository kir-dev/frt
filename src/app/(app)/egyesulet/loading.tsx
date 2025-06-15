export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="border-t-2 border-red-600 w-full"></div>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-10 w-96 bg-gray-800 animate-pulse rounded"></div>
                </div>

                <div className="space-y-4 mb-12">
                    <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-6 w-48 bg-gray-800 animate-pulse rounded mt-8"></div>
                    <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-6 w-56 bg-gray-800 animate-pulse rounded mt-8"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-32 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-32 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-32 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-32 bg-gray-800 animate-pulse rounded"></div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-6 w-40 bg-gray-800 animate-pulse rounded"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gray-800 animate-pulse rounded"></div>
                            <div className="h-4 w-48 bg-gray-800 animate-pulse rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gray-800 animate-pulse rounded"></div>
                            <div className="h-4 w-56 bg-gray-800 animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                    <div className="h-6 w-24 bg-gray-800 animate-pulse rounded mb-4"></div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 w-full bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded"></div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="h-10 w-36 bg-gray-800 animate-pulse rounded"></div>
                        <div className="h-10 w-40 bg-gray-800 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
