"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the dropdown menu structure based on the requirements
const navItems = [
    {
        name: "Hírek",
        nameEn: "News",
        href: "/hirek",
        dropdown: null,
    },
    {
        name: "Versenyzés",
        nameEn: "Racing",
        href: "/versenyzes",
        dropdown: [
            { name: "Esemény naptár", nameEn: "Event calendar", href: "/versenyzes/esemeny-naptar" },
            { name: "Formula Student", nameEn: "Formula Student", href: "/versenyzes/formula-student" },
            { name: "Autók", nameEn: "Cars", href: "/versenyzes/autok" },
        ],
    },
    {
        name: "Támogatás",
        nameEn: "Sponsors",
        href: "/tamogatas",
        dropdown: [
            { name: "Támogatók", nameEn: "Sponsors", href: "/tamogatas/tamogatok" },
            { name: "Támogass minket", nameEn: "Support Us", href: "/tamogatas/tamogass-minket" },
        ],
    },
    {
        name: "Rólunk",
        nameEn: "About us",
        href: "/rolunk",
        dropdown: [
            { name: "Egyesület", nameEn: "Association", href: "/rolunk/egyesulet" },
            { name: "Publikációk", nameEn: "Publications", href: "/rolunk/publikaciok" },
            { name: "Tag felvétel", nameEn: "Joining process", href: "/rolunk/tag-felvetel" },
            { name: "Galéria", nameEn: "Gallery", href: "/rolunk/galeria" },
        ],
    },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [language, setLanguage] = useState("hu") // Default language is Hungarian
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
    const pathname = usePathname()

    // Handle scroll event to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Toggle mobile menu
    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    // Toggle mobile dropdown
    const toggleMobileDropdown = (name: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setOpenMobileDropdown(openMobileDropdown === name ? null : name)
    }

    // Toggle language
    const toggleLanguage = () => {
        setLanguage(language === "hu" ? "en" : "hu")
    }

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-black shadow-lg" : "bg-black bg-opacity-90",
            )}
        >
            <div className="container min-w-screen px-6 font-frtszoveg text-xl">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/FRT_felirat_white.svg"
                            alt="BME Formula Racing Team"
                            width={150}
                            height={50}
                            className="h-12 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-2 text-white hover:text-frtRed transition-colors",
                                        pathname === item.href && "text-frtRed",
                                    )}
                                >
                                    {language === "hu" ? item.name : item.nameEn}
                                </Link>

                                {/* Dropdown Menu (appears on hover) */}
                                {item.dropdown && (
                                    <div className="absolute left-0 mt-2 w-48 bg-black bg-opacity-90 shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-left">
                                        {item.dropdown.map((dropdownItem) => (
                                            <Link
                                                key={dropdownItem.name}
                                                href={dropdownItem.href}
                                                className="block px-4 py-2 text-white hover:bg-gray-600 hover:text-white transition-colors"
                                            >
                                                {language === "hu" ? dropdownItem.name : dropdownItem.nameEn}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="ml-4 w-10 h-10 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                        >
                            {language === "hu" ? "EN" : "HU"}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMenu} className="lg:hidden text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={cn(
                    "lg:hidden bg-black overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-screen" : "max-h-0",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="container mx-auto px-4 py-2">
                    {navItems.map((item) => (
                        <div key={item.name} className="">
                            {item.dropdown ? (
                                <>
                                    <button
                                        onClick={(e) => toggleMobileDropdown(item.name, e)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-white hover:text-frtRed transition-colors flex items-center justify-between",
                                            pathname === item.href && "text-frtRed",
                                        )}
                                    >
                                        <span>{language === "hu" ? item.name : item.nameEn}</span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 transition-transform duration-200",
                                                openMobileDropdown === item.name ? "rotate-180" : "rotate-0",
                                            )}
                                        />
                                    </button>

                                    {/* Mobile Dropdown */}
                                    <div
                                        className={cn(
                                            "pl-6 space-y-1 overflow-hidden transition-all duration-300",
                                            openMobileDropdown === item.name ? "max-h-96 py-2" : "max-h-0",
                                        )}
                                    >
                                        {item.dropdown.map((dropdownItem) => (
                                            <Link
                                                key={dropdownItem.name}
                                                href={dropdownItem.href}
                                                className="block px-3 py-2 text-white hover:text-frtRed transition-colors"
                                            >
                                                {language === "hu" ? dropdownItem.name : dropdownItem.nameEn}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "block px-3 py-2 text-white hover:text-frtRed transition-colors",
                                        pathname === item.href && "text-frtRed",
                                    )}
                                >
                                    {language === "hu" ? item.name : item.nameEn}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Mobile Language Switcher */}
                    <div className="mt-2">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center px-3 py-2 text-white hover:text-frtRed transition-colors"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white font-bold rounded-lg mr-2">
                                {language === "hu" ? "EN" : "HU"}
                            </div>
                            {language === "hu" ? "English" : "Magyar"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Red line under navbar */}
            <div className="h-1 bg-frtRed w-full"></div>
        </nav>
    )
}
