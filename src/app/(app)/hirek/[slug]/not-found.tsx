import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ArticleNotFound() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold mb-4">A keresett cikk nem található</h2>
                <p className="mb-6 text-gray-400">A cikk nem létezik vagy eltávolításra került.</p>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                    <Link href="/hirek">Vissza a hírekhez</Link>
                </Button>
            </div>
        </div>
    )
}
