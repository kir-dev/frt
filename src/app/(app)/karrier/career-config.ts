import type { CareerSetting } from "@/payload-types"
import type { ApplicationConfig } from "./types"

/**
 * A "Karrier oldal" globális beállításból egyetlen, a nézetben közvetlenül
 * használható objektumot állít elő, hogy a komponensekben ne kelljen újra és
 * újra a nullable CMS mezőkkel bajlódni.
 */
export function resolveApplicationConfig(
    settings: CareerSetting | null,
    isEn: boolean,
    closedTextFallback: string,
): ApplicationConfig {
    const closedText = isEn ? settings?.applicationsClosedTextEng : settings?.applicationsClosedText

    return {
        isOpen: settings?.applicationsOpen !== false,
        useBuiltInForm: (settings?.applicationMode ?? "builtIn") === "builtIn",
        googleFormUrl: settings?.googleFormUrl?.trim() || null,
        closedText: closedText?.trim() || closedTextFallback,
    }
}
