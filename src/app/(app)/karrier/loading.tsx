export default function Loading() {
    return (
        <div className="career-page min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="h-10 w-64 bg-career-accent-soft animate-pulse rounded mx-auto mb-6"></div>
                <div className="h-4 w-full max-w-2xl bg-career-accent-soft animate-pulse rounded mx-auto mb-2"></div>
                <div className="h-4 w-2/3 max-w-xl bg-career-accent-soft animate-pulse rounded mx-auto mb-12"></div>

                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-career-surface ring-1 ring-inset ring-career-border rounded-lg overflow-hidden animate-pulse">
                            <div className="flex flex-col sm:flex-row">
                                <div className="h-44 w-full sm:h-40 sm:w-56 bg-career-accent-soft shrink-0"></div>
                                <div className="flex-1 px-5 py-5">
                                    <div className="h-7 w-48 bg-career-accent-soft mb-4 rounded"></div>
                                    <div className="h-4 w-full bg-career-accent-soft mb-2 rounded"></div>
                                    <div className="h-4 w-3/4 bg-career-accent-soft mb-4 rounded"></div>
                                    <div className="h-3 w-32 bg-career-accent-soft rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
