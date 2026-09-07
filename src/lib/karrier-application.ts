/**
 * A Karrier oldal jelentkezési űrlapjának szerveroldali validálása.
 * A nyers kérés-törzsből vagy egy hibakódot, vagy egy tisztított, menthető
 * adathalmazt ad vissza.
 */

const MAX_LENGTHS = {
    name: 120,
    email: 200,
    phone: 40,
    university: 120,
    major: 120,
    semester: 40,
    groupName: 200,
    positionName: 200,
    motivation: 5000,
} as const

type Field = keyof typeof MAX_LENGTHS

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ApplicationInput = {
    [K in Field]: K extends "name" | "email" ? string : string | null
} & { consent: true }

export type ParseResult =
    | { ok: true; data: ApplicationInput }
    | { ok: false; error: "MISSING_FIELDS" | "INVALID_EMAIL" }
    /** A rejtett mező kitöltve: bot. Sikeres választ adunk, de nem mentünk. */
    | { ok: false; error: "HONEYPOT" }

function readString(value: unknown, field: Field): string | null {
    if (typeof value !== "string") return null
    const trimmed = value.trim()
    if (!trimmed) return null
    return trimmed.slice(0, MAX_LENGTHS[field])
}

export function parseApplicationInput(body: Record<string, unknown>): ParseResult {
    // Rejtett mező: valódi látogató sosem tölti ki, a botok viszont igen.
    if (typeof body.website === "string" && body.website.trim() !== "") {
        return { ok: false, error: "HONEYPOT" }
    }

    const name = readString(body.name, "name")
    const email = readString(body.email, "email")

    if (!name || !email || body.consent !== true) {
        return { ok: false, error: "MISSING_FIELDS" }
    }

    if (!EMAIL_PATTERN.test(email)) {
        return { ok: false, error: "INVALID_EMAIL" }
    }

    return {
        ok: true,
        data: {
            name,
            email,
            phone: readString(body.phone, "phone"),
            university: readString(body.university, "university"),
            major: readString(body.major, "major"),
            semester: readString(body.semester, "semester"),
            groupName: readString(body.groupName, "groupName"),
            positionName: readString(body.positionName, "positionName"),
            motivation: readString(body.motivation, "motivation"),
            consent: true,
        },
    }
}
