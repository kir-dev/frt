export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col items-start gap-3 mb-8">
          <div className="w-24 h-12 mb-12 bg-red-950 animate-pulse rounded"></div>
          <div className="w-12 h-8 bg-red-950 animate-pulse rounded"></div>
        </div>

        <div className="flex flex-col items-start gap-3 mb-8">
          <div className="w-24 h-8 mb-12 bg-red-950 animate-pulse rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-48 w-60 bg-red-950 animate-pulse rounded"></div>
            <div className="h-48 w-60 bg-red-950 animate-pulse rounded"></div>
            <div className="h-48 w-60 bg-red-950 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 mb-8">
          <div className="w-24 h-8 mb-12 bg-red-950 animate-pulse rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-48 w-60 bg-red-950 animate-pulse rounded"></div>
            <div className="h-48 w-60 bg-red-950 animate-pulse rounded"></div>
            <div className="h-48 w-60 bg-red-950 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
