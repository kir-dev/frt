"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { DesktopNav } from "@/components/navbar/desktop-nav";
import { MobileNav } from "@/components/navbar/mobile-nav";
import { NAV_ITEMS } from "@/config/navigation";
import { useNavbar } from "@/hooks/use-navbar";
import { cn } from "@/lib/utils";

// Create a client component that uses the search params
function NavbarContent() {
  const {
    isOpen,
    isScrolled,
    language,
    openMobileDropdown,
    openDesktopDropdown,
    setOpenDesktopDropdown,
    toggleMenu,
    toggleMobileDropdown,
    handleDesktopDropdownClick,
    toggleLanguage,
    addLangToHref,
  } = useNavbar();

  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 !bg-frtRed",
        isScrolled ? "shadow-lg" : ""
      )}
    >
      <div className="container min-w-screen px-6 font-frtszoveg text-xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={addLangToHref("/")} className="flex items-center">
            <Image
              src="/FRT_felirat_white.svg"
              alt="BME Formula Racing Team"
              width={150}
              height={50}
              className="h-10 w-auto lg:h-12 transition-all duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav
            navItems={NAV_ITEMS}
            language={language}
            addLangToHref={addLangToHref}
            openDesktopDropdown={openDesktopDropdown}
            setOpenDesktopDropdown={setOpenDesktopDropdown}
            handleDesktopDropdownClick={handleDesktopDropdownClick}
            toggleLanguage={toggleLanguage}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden !text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isOpen}
        navItems={NAV_ITEMS}
        language={language}
        pathname={pathname || ""}
        addLangToHref={addLangToHref}
        openMobileDropdown={openMobileDropdown}
        toggleMobileDropdown={toggleMobileDropdown}
        toggleLanguage={toggleLanguage}
      />

      {/* Red line under navbar */}
      <div className="h-1 !bg-frtRed w-full"></div>
    </nav>
  );
}

// Navbar component that wraps the content in a Suspense boundary
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <nav className="fixed top-0 left-0 right-0 z-50 bg-frtRed">
          <div className="container min-w-screen px-6 font-frtszoveg text-xl">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <div className="h-12 w-[150px]"></div>
              </div>
            </div>
          </div>
        </nav>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
