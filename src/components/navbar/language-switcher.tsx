"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  language: string;
  toggleLanguage: () => void;
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitcher({
  language,
  toggleLanguage,
  className,
  showLabel = false,
}: LanguageSwitcherProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center px-3 py-2 font-bold transition-colors outline-none border-0 shadow-none rounded-lg",
        // Theme based styles - keeping original logic but cleaning up
        showLabel 
          ? (theme === "dark" ? "text-white hover:bg-gray-700 hover:text-frtRed" : "text-gray-900 hover:bg-gray-200 hover:text-frtRed")
          : "!text-white hover:text-white",
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center font-bold rounded-lg mr-2",
           showLabel 
            ? (theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900")
            : "hover:bg-red-400 !text-white"
        )}
      >
        {language === "hu" ? "EN" : "HU"}
      </div>
      {showLabel && (language === "hu" ? "English" : "Magyar")}
    </button>
  );
}
