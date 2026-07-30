/**
 * Jelentkezések továbbítása egy Google Sheets táblázatba.
 *
 * A táblázat oldalán egy Google Apps Script webalkalmazás fogadja a POST kérést
 * és beszúrja az új sort. A beállítás lépései a README-ben találhatók.
 *
 * Szükséges környezeti változók:
 *   GOOGLE_SHEETS_WEBHOOK_URL — az Apps Script webalkalmazás /exec URL-je
 *   GOOGLE_SHEETS_WEBHOOK_SECRET — közös titok, a szkript ezt ellenőrzi (opcionális, de ajánlott)
 *
 * Ha a GOOGLE_SHEETS_WEBHOOK_URL nincs beállítva, a szinkronizálás csendben kimarad:
 * a jelentkezés ilyenkor is elmentődik a Payload adminban.
 */

export type SheetSyncResult =
    | { status: "skipped" }
    | { status: "ok" }
    | { status: "error"; message: string };

// A jelentkező a válaszra vár, ezért rövid a türelmi idő: ha a webhook lassú,
// a jelentkezés attól még elmentve marad a Payloadban.
const WEBHOOK_TIMEOUT_MS = 5_000;

export async function sendApplicationToSheet(
    row: Record<string, unknown>,
): Promise<SheetSyncResult> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!url) {
    return { status: "skipped" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? "",
        ...row,
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        status: "error",
        message: `A Google Sheets webhook ${response.status} státusszal válaszolt.`,
      };
    }

    return { status: "ok" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Ismeretlen hiba",
    };
  }
}
