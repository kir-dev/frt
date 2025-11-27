"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";

interface MobileNavProps {
  isOpen: boolean;
  navItems: NavItem[];
  language: string;
  pathname: string;
  addLangToHref: (href: string) => string;
  openMobileDropdown: string | null;
  toggleMobileDropdown: (name: string, e: React.MouseEvent) => void;
  toggleLanguage: () => void;
}

export function MobileNav({
  isOpen,
  navItems,
  language,
  pathname,
  addLangToHref,
  openMobileDropdown,
  toggleMobileDropdown,
  toggleLanguage,
}: MobileNavProps) {
  return (
    <div
      className={cn(
        "lg:hidden bg-black overflow-hidden transition-all duration-300",
        isOpen ? "max-h-screen" : "max-h-0"
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
                    "w-full text-left px-3 py-2 text-white hover:text-frtRed transition-colors flex items-center justify-between"
                  )}
                >
                  <span>{language === "hu" ? item.name : item.nameEn}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openMobileDropdown === item.name
                        ? "rotate-180"
                        : "rotate-0"
                    )}
                  />
                </button>

                {/* Mobile Dropdown */}
                <div
                  className={cn(
                    "pl-6 space-y-1 overflow-hidden transition-all duration-300",
                    openMobileDropdown === item.name
                      ? "max-h-96 py-2"
                      : "max-h-0"
                  )}
                >
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.name}
                      href={addLangToHref(dropdownItem.href)}
                      className="block px-3 py-2 text-white hover:text-frtRed transition-colors"
                    >
                      {language === "hu"
                        ? dropdownItem.name
                        : dropdownItem.nameEn}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={addLangToHref(item.href)}
                className={cn(
                  "block px-3 py-2 text-white hover:text-frtRed transition-colors",
                  pathname === item.href && "text-frtRed"
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
          <LanguageSwitcher
            language={language}
            toggleLanguage={toggleLanguage}
            showLabel={true}
          />
        </div>
      </div>
    </div>
  );
}
