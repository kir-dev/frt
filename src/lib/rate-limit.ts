/**
 * Egyszerű, memóriában tartott kérés-korlátozó. Egy futó példányon belül véd a
 * tömeges beküldés ellen; több példány esetén példányonként számol.
 */
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
    const hits = new Map<string, number[]>()

    return function isRateLimited(key: string): boolean {
        const now = Date.now()
        const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs)

        if (recent.length >= max) {
            hits.set(key, recent)
            return true
        }

        recent.push(now)
        hits.set(key, recent)
        return false
    }
}

/** A kérést küldő kliens azonosítása a proxy fejlécei alapján. */
export function clientIp(request: Request): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown"
    )
}
