"use client";

import { CarSection } from "@/components/car/car-section";
import { cn } from "@/lib/utils";
import { Car } from "@/payload-types";
import { useCallback, useEffect, useRef, useState } from "react";

interface CarsPageClientProps {
  cars: Car[];
  lang: string;
}

interface TOCItem {
  id: string;
  year: number;
  names: string[];
}

export default function CarsPageClient({ cars, lang }: CarsPageClientProps) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);

  const tocItems: TOCItem[] = cars.map((car) => {
    // Split names by " és " or " and " to handle multiple cars in one year
    const names = car.name.split(/ és | and /).map((n) => n.trim());
    return {
      id: `car-${car.id}`,
      year: car.year,
      names: names,
    };
  });

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbar = document.querySelector("nav");
      const navbarHeight = navbar ? (navbar as HTMLElement).offsetHeight : 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 20;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -50% 0px",
        threshold: 0.1,
      }
    );

    cars.forEach((car) => {
      const element = document.getElementById(`car-${car.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [cars]);

  useEffect(() => {
    if (activeId && navRef.current) {
      const activeElement = document.getElementById(`toc-${activeId}`);
      if (activeElement) {
        const container = navRef.current;
        const elementTop = activeElement.offsetTop;
        const elementHeight = activeElement.offsetHeight;
        const containerHeight = container.offsetHeight;
        
        // Calculate the scroll position to center the element
        const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  }, [activeId]);

  if (!cars || cars.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-3xl font-bold text-center mb-12">
            {lang === "en" ? "Cars" : "Autók"}
          </h1>
          <p className="text-center text-xl">
            {lang === "en" ? "No cars found." : "Nem található autó."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex flex-col lg:flex-row justify-center gap-8 container mx-auto px-4 py-12">
        {/* Main content */}
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">
            {lang === "en" ? "Cars" : "Autók"}
          </h1>
          {cars.map((car) => (
            <CarSection car={car} key={car.id} lang={lang} />
          ))}
        </div>

        {/* Sticky TOC */}
        <div className="hidden lg:block sticky top-[200px] self-start">
          <div 
            ref={navRef}
            className="bg-frtcardBG backdrop-blur-sm rounded-lg pb-5 px-5 w-64 mb-4 max-h-[calc(100vh-240px)] overflow-y-auto no-scrollbar"
          >
            <h3 className="sticky top-0 z-20 text-base font-bold mb-3 text-red-400 bg-frtcardBG py-3 -mx-5 px-5 shadow-sm">
              {lang === "en" ? "On this page" : "Oldal tartalma"}
            </h3>
            <nav>
              <div className="space-y-3">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    id={`toc-${item.id}`}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "block text-left transition-colors w-full group",
                      activeId === item.id
                        ? "text-red-400"
                        : "hover:text-red-400"
                    )}
                  >
                    <span className="font-bold block mb-1">{item.year}</span>
                    <div
                      className={cn(
                        "pl-2 border-l-2 transition-colors",
                        activeId === item.id
                          ? "border-red-400"
                          : "border-gray-700 group-hover:border-red-400"
                      )}
                    >
                      {item.names.map((name, index) => (
                        <span key={index} className="block text-sm py-0.5">
                          {name}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Hide scrollbar globally for .no-scrollbar while keeping scroll functional */}
      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>
    </main>
  );
}
