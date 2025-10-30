"use client";

import { Car } from "@/payload-types";
import { CarSection } from "@/components/car/car-section";
import { useCallback } from "react";

interface CarsPageClientProps {
  cars: Car[];
  lang: string;
}

interface TOCItem {
  id: string;
  title: string;
}

export default function CarsPageClient({ cars, lang }: CarsPageClientProps) {
  const tocItems: TOCItem[] = cars.map((car) => ({
    id: `car-${car.id}`,
    title: `${car.year} - ${car.name}`,
  }));

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
          <div className="bg-frtcardBG backdrop-blur-sm rounded-lg pb-5 px-5 w-64 mb-4 max-h-[calc(100vh-240px)] overflow-y-auto no-scrollbar">
            <h3 className="sticky top-0 z-20 text-base font-bold mb-3 text-red-400 bg-frtcardBG py-3 -mx-5 px-5 shadow-sm">
              {lang === "en" ? "On this page" : "Oldal tartalma"}
            </h3>
            <nav>
              <div className="space-y-3">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-left transition-colors hover:text-red-400 w-full"
                  >
                    {item.title}
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
