"use client"
import { useEffect, useState } from "react"

interface TOCItem {
    id: string
    title: string
    level: number
}

interface TableOfContentsProps {
    items: TOCItem[]
    lang: string
}

export function TableOfContents({ items, lang }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-20% 0% -35% 0%" },
        )

        const headings = document.querySelectorAll("h1[id], h2[id], section[id]")
        headings.forEach((heading) => observer.observe(heading))

        return () => observer.disconnect()
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // Get navbar height to offset the scroll position
            const navbar = document.querySelector("nav") // Assuming your navbar has a nav tag
            const navbarHeight = navbar ? navbar.offsetHeight : 80 // Default to 80px if navbar not found

            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - navbarHeight - 20 // Extra 20px for spacing

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
    }

    const tocTitle = lang === "en" ? "Table of Contents" : "Tartalomjegyzék"

    return (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-red-950/80 backdrop-blur-sm rounded-lg p-4 max-w-xs hidden lg:block">
            <h3 className="text-base font-bold mb-3 text-red-400">{tocTitle}</h3>
            <nav className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block text-left transition-colors hover:text-red-400 w-full ${
                            activeId === item.id ? "text-red-400 font-medium" : "text-gray-300"
                        } ${item.level === 2 ? "pl-3" : ""}`}
                    >
                        {item.title}
                    </button>
                ))}
            </nav>
        </div>
    )
}
