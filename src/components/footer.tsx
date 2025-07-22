import SocialsSection from "@/components/socialsSection";

export default function Footer() {
    return (
        <footer className="bg-black text-white border-t border-frtRed">
            <div className="container mx-auto py-6 flex flex-col items-center justify-center font-frtszoveg">
                <p className="text-sm mb-4">Copyright © 2025 BME Formula Racing Team</p>
                <SocialsSection/>
                <p className="text-xs text-gray-400">Made with ❤️ by Kir-Dev</p>
            </div>
        </footer>
    )
}
