"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState("hu");
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize language from URL on component mount
  useEffect(() => {
    if (!searchParams) return;
    const langParam = searchParams.get("lang");
    if (langParam === "en" || langParam === "hu") {
      setLanguage(langParam);
    }
  }, [searchParams]);

  // Reset state on path change
  useEffect(() => {
    setIsOpen(false);
    setOpenMobileDropdown(null);
    setOpenDesktopDropdown(null);
  }, [pathname]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const toggleMobileDropdown = useCallback((name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMobileDropdown((prev) => (prev === name ? null : name));
  }, []);

  const handleDesktopDropdownClick = useCallback((name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDesktopDropdown((prev) => (prev === name ? null : name));
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === "hu" ? "en" : "hu";
    setLanguage(newLang);
    if (!searchParams) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("lang", newLang);
    router.replace(`${pathname}?${params.toString()}`);
  }, [language, pathname, router, searchParams]);

  const addLangToHref = useCallback((href: string) => {
    if (!searchParams) return href;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("lang", language);
    const hasQuery = href.includes("?");
    return hasQuery
      ? `${href}&${params.toString()}`
      : `${href}?${params.toString()}`;
  }, [language, searchParams]);

  return {
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
  };
}
