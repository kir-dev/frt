export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col items-start gap-3 mb-8">
          <div className="w-44 h-12 mb-12 bg-red-950 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-2 items-start gap-8 mb-8">
          <div className="h-56 w-96 bg-red-950 animate-pulse rounded"></div>
          <div className="h-56 w-96 bg-red-950 animate-pulse rounded"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col items-start gap-3 mb-8">
          <div className="w-44 h-12 mb-12 bg-red-950 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-3 items-start gap-8 mb-8">
          <div className="h-42 w-64 bg-red-950 animate-pulse rounded"></div>
          <div className="h-42 w-64 bg-red-950 animate-pulse rounded"></div>
          <div className="h-42 w-64 bg-red-950 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}
