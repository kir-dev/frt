"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";

interface DesktopNavProps {
  navItems: NavItem[];
  language: string;
  addLangToHref: (href: string) => string;
  openDesktopDropdown: string | null;
  setOpenDesktopDropdown: (name: string | null) => void;
  handleDesktopDropdownClick: (name: string, e: React.MouseEvent) => void;
  toggleLanguage: () => void;
}

export function DesktopNav({
  navItems,
  language,
  addLangToHref,
  openDesktopDropdown,
  setOpenDesktopDropdown,
  handleDesktopDropdownClick,
  toggleLanguage,
}: DesktopNavProps) {
  return (
    <div className="hidden min-[1295px]:flex items-center space-x-8">
      {navItems.map((item) => (
        <div key={item.name} className="relative group">
          <Link
            href={addLangToHref(item.href)}
            className={cn(
              "px-3 py-2 !text-white hover:text-frtRed transition-colors"
            )}
            onClick={
              item.dropdown
                ? (e) => handleDesktopDropdownClick(item.name, e)
                : undefined
            }
          >
            {language === "hu" ? item.name : item.nameEn}
            {item.dropdown && <ChevronDown className="inline ml-1 w-4 h-4" />}
          </Link>

          {/* Dropdown Menu */}
          {item.dropdown && (
            <div
              className={cn(
                "absolute left-0 z-50 mt-2 w-48 bg-black shadow-lg rounded-md overflow-hidden transition-all duration-300 origin-top-left",
                openDesktopDropdown === item.name
                  ? "opacity-100 visible"
                  : "opacity-0 invisible",
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
      <LanguageSwitcher language={language} toggleLanguage={toggleLanguage} />
    </div>
  );
}
