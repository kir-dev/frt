import Link from "next/link";
import {Facebook, Instagram, Linkedin, Mail, Twitter, Youtube} from "lucide-react";

export default function SocialsSection() {
    return (
        <div className="flex space-x-4 mb-4">
            <Link
                href="https://www.facebook.com/FormulaRacingTeam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frtRed hover:text-red-400"
            >
                <Facebook size={20}/>
                <span className="sr-only">Facebook</span>
            </Link>
            <Link
                href="https://www.instagram.com/bme_formularacingteam/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frtRed hover:text-red-400"
            >
                <Instagram size={20}/>
                <span className="sr-only">Instagram</span>
            </Link>
            <Link
                href="https://twitter.com/bme_frt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frtRed hover:text-red-400"
            >
                <Twitter size={20}/>
                <span className="sr-only">Twitter</span>
            </Link>
            <Link
                href="https://www.youtube.com/user/bmeFRT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frtRed hover:text-red-400"
            >
                <Youtube size={20}/>
                <span className="sr-only">YouTube</span>
            </Link>
            <Link
                href="https://www.linkedin.com/company/bmefrt/mycompany/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frtRed hover:text-red-400"
            >
                <Linkedin size={20}/>
                <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
                href="mailto:info.bme.frt@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frtRed hover:text-red-400"
            >
                <Mail size={20}/>
                <span className="sr-only">Email</span>
            </Link>
        </div>
    )
}