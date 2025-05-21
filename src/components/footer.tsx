import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-black text-white border-t border-frtRed">
            <div className="container mx-auto py-6 flex flex-col items-center justify-center">
                <p className="text-sm mb-4">Copyright © 2025 BME Formula Racing Team</p>
                <div className="flex space-x-4 mb-4">
                    <Link
                        href="https://facebook.com/frt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frtRed hover:text-red-400"
                    >
                        <Facebook size={20} />
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link
                        href="https://instagram.com/frt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frtRed hover:text-red-400"
                    >
                        <Instagram size={20} />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link
                        href="https://twitter.com/frt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frtRed hover:text-red-400"
                    >
                        <Twitter size={20} />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link
                        href="https://youtube.com/frt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frtRed hover:text-red-400"
                    >
                        <Youtube size={20} />
                        <span className="sr-only">YouTube</span>
                    </Link>
                    <Link
                        href="https://linkedin.com/company/frt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frtRed hover:text-red-400"
                    >
                        <Linkedin size={20} />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link
                        href="mailto:contact@frt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frtRed hover:text-red-400"
                    >
                        <Mail size={20} />
                        <span className="sr-only">Email</span>
                    </Link>
                </div>
                <p className="text-sm text-gray-400">Made with ❤️ by Kir-Dev</p>
            </div>
        </footer>
    )
}
