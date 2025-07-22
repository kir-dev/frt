"use client"

import type React from "react"

import { useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

// Define the dropdown menu structure based on the requirements
const navItems = [
    {
        name: "Admin",
        nameEn: "Admin",
        href: "/admin",
        dropdown: null,
    },
    {
        name: "Olvasni valók",
        nameEn: "Reading Materials",
        href: "",
        dropdown: [
            { name: "Hírek", nameEn: "News", href: "/hirek" },
            { name: "Publikációk", nameEn: "Publications", href: "/publikaciok" },
        ],
    },
    {
        name: "Versenyzés",
        nameEn: "Racing",
        href: "",
        dropdown: [
            { name: "Formula Student", nameEn: "Formula Student", href: "/formula-student" },
            { name: "Autók", nameEn: "Cars", href: "/autok" },
        ],
    },
    {
        name: "Támogatás",
        nameEn: "Sponsors",
        href: "",
        dropdown: [
            { name: "Támogatók", nameEn: "Sponsors", href: "/tamogatok" },
            { name: "Támogass minket", nameEn: "Support Us", href: "/not-found" },
        ],
    },
    {
        name: "Rólunk",
        nameEn: "About us",
        href: "",
        dropdown: [
            { name: "Csapat", nameEn: "Team", href: "/rolunk" },
            { name: "Esemény naptár", nameEn: "Event calendar", href: "/not-found" },
            { name: "Tagfelvétel", nameEn: "Joining process", href: "/tagfelvetel" },
            { name: "Kapcsolat", nameEn: "Contact", href: "/kapcsolat" },
            { name: "Egyesület", nameEn: "Association", href: "/egyesulet" },
            { name: "Galéria", nameEn: "Gallery", href: "/not-found" },
        ],
    },
]

// Create a client component that uses the search params
function NavbarContent() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [language, setLanguage] = useState("hu")
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
    const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null)
    const pathname = usePathname()
    const router = useRouter();
    const searchParams = useSearchParams();
    const { theme } = useTheme();

    // Initialize language from URL on component mount
    useEffect(() => {
        if (!searchParams) return;
        const langParam = searchParams.get("lang");
        if (langParam === "en" || langParam === "hu") {
            setLanguage(langParam);
        }
    }, [searchParams]);

    useEffect(() => {
        setIsOpen(false);
        setOpenMobileDropdown(null);
        setOpenDesktopDropdown(null); // Ensure the desktop dropdown closes when the page changes
    }, [pathname]);

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
        const newLang = language === "hu" ? "en" : "hu";
        setLanguage(newLang);
        if (!searchParams) return;
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("lang", newLang);
        router.replace(`${pathname}?${params.toString()}`);
    }

    // Desktop dropdown kattintás kezelése
    const handleDesktopDropdownClick = (name: string, e: React.MouseEvent) => {
        e.preventDefault();
        setOpenDesktopDropdown(openDesktopDropdown === name ? null : name);
    }

    function addLangToHref(href: string) {
        if (!searchParams) return href;
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("lang", language);
        const hasQuery = href.includes("?");
        return hasQuery ? `${href}&${params.toString()}` : `${href}?${params.toString()}`;
    }

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 !bg-frtRed",
                isScrolled ? "shadow-lg" : "",
            )}
        >
            <div className="container min-w-screen px-6 font-frtszoveg text-xl">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href={addLangToHref("/")} className="flex items-center">
                        <Image
                            src= "/FRT_felirat_white.svg"
                            alt="BME Formula Racing Team"
                            width={150}
                            height={50}
                            className="h-10 w-auto lg:h-12 transition-all duration-200"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={addLangToHref(item.href)}
                                    className={cn(
                                        "px-3 py-2 !text-white hover:text-frtRed transition-colors",
                                    )}
                                    onClick={item.dropdown ? (e) => handleDesktopDropdownClick(item.name, e) : undefined}
                                >
                                    {language === "hu" ? item.name : item.nameEn}
                                    {item.dropdown && (
                                        <ChevronDown className="inline ml-1 w-4 h-4" />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.dropdown && (
                                    <div
                                        className={cn(
                                            "absolute left-0 z-50 mt-2 w-48 bg-black shadow-lg rounded-md overflow-hidden transition-all duration-300 origin-top-left",
                                            (openDesktopDropdown === item.name || (typeof window !== 'undefined' && document.activeElement && document.activeElement === document.body && false)) ? "opacity-100 visible" : "opacity-0 invisible",
                                            "group-hover:opacity-100 group-hover:visible"
                                        )}
                                        onMouseLeave={() => setOpenDesktopDropdown(null)}
                                    >
                                        {item.dropdown.map((dropdownItem) => (
                                            <Link
                                                key={dropdownItem.name}
                                                href={addLangToHref(dropdownItem.href)}
                                                className="block px-4 py-2 z-50 text-white hover:bg-gray-600 hover:text-white transition-colors"
                                            >
                                                {language === "hu" ? dropdownItem.name : dropdownItem.nameEn}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <ThemeToggle />
                        <button
                            onClick={toggleLanguage}
                            className={
                                `flex items-center px-3 py-2 font-bold transition-colors outline-none border-0 shadow-none rounded-lg 
                                ${theme === "dark"
                                    ? "!text-white hover:text-white"
                                    : "!text-white hover:text-white"}
                                `
                            }
                            style={{ boxShadow: 'none', border: 'none' }}
                        >
                            <div className={
                                `w-10 h-10 flex items-center justify-center font-bold rounded-lg mr-2 hover:bg-red-400
                                ${theme === "dark"
                                    ? "!text-white"
                                    : "!text-white"}
                                `
                            }>
                                {language === "hu" ? "EN" : "HU"}
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMenu} className="lg:hidden !text-white focus:outline-none">
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

                    {/* Mobile Language Switcher & ThemeToggle in one row */}
                    <div className="mt-2 flex flex-row gap-2 items-center">
                        <ThemeToggle />
                        <button
                            onClick={toggleLanguage}
                            className={
                                `flex items-center px-3 py-2 font-bold transition-colors outline-none border-0 shadow-none
                                ${theme === "dark"
                                    ? "text-white hover:bg-gray-700 hover:text-frtRed"
                                    : "text-gray-900 hover:bg-gray-200 hover:text-frtRed"}
                                `
                            }
                            style={{ boxShadow: 'none', border: 'none' }}
                        >
                            <div className={
                                `w-8 h-8 flex items-center justify-center font-bold rounded-lg mr-2
                                ${theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-200 text-gray-900"}
                                `
                            }>
                                {language === "hu" ? "EN" : "HU"}
                            </div>
                            {language === "hu" ? "English" : "Magyar"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Red line under navbar */}
            <div className="h-1 !bg-frtRed w-full"></div>
        </nav>
    );
}

// Navbar component that wraps the content in a Suspense boundary
export default function Navbar() {
    return (
        <Suspense fallback={
            <nav className="fixed top-0 left-0 right-0 z-50 bg-frtRed">
                <div className="container min-w-screen px-6 font-frtszoveg text-xl">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <div className="h-12 w-[150px]"></div>
                        </div>
                    </div>
                </div>
            </nav>
        }>
            <NavbarContent />
        </Suspense>
    );
}
