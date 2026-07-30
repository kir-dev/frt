import { createSign } from "node:crypto";

/**
 * Google Sheets kliens szolgáltatásfiókkal.
 *
 * A megrendelő az adminban egy táblázat-linket ad meg, és a táblázatot
 * megosztja szerkesztőként a szolgáltatásfiók e-mail címével — más teendője
 * nincs. A hitelesítéshez nem kell külső csomag: a JWT-t a node:crypto írja alá.
 *
 * Környezeti változók:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL       — a szolgáltatásfiók címe
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY — a hozzá tartozó privát kulcs (\n-ekkel)
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const REQUEST_TIMEOUT_MS = 10_000;

/** A táblázat fejlécsora; az adatsorok is ebben a sorrendben mennek ki. */
export const SHEET_COLUMNS = [
  "Beküldve",
  "Név",
  "E-mail",
  "Telefon",
  "Egyetem / kar",
  "Szak",
  "Félév",
  "Csoport",
  "Pozíció",
  "Motiváció",
] as const;

export type ApplicationRow = {
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  semester: string;
  group: string;
  position: string;
  motivation: string;
};

export type SheetResult = { status: "ok" } | { status: "skipped"; reason: string } | { status: "error"; message: string };

export function serviceAccountEmail(): string | null {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || null;
}

function privateKey(): string | null {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  // A .env-ben a kulcs egy sorban áll, a sortörések \n-ként szerepelnek benne.
  return key ? key.replace(/\\n/g, "\n") : null;
}

export function isSheetsConfigured(): boolean {
  return Boolean(serviceAccountEmail() && privateKey());
}

/** A megosztandó táblázat-URL-ből kiszedi a táblázat azonosítóját. */
export function spreadsheetIdFromUrl(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

const base64Url = (value: string | Buffer) =>
    Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const email = serviceAccountEmail();
  const key = privateKey();
  if (!email || !key) {
    throw new Error("Nincs beállítva a Google szolgáltatásfiók.");
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600,
  };

  const unsigned = `${base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64Url(JSON.stringify(payload))}`;
  const signature = base64Url(createSign("RSA-SHA256").update(unsigned).sign(key));

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const body = await response.json();
  if (!response.ok || !body.access_token) {
    throw new Error(`Google hitelesítés sikertelen: ${body.error_description ?? response.status}`);
  }

  cachedToken = { value: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
  return cachedToken.value;
}

async function sheetsRequest(path: string, init: RequestInit = {}) {
  const token = await accessToken();

  const response = await fetch(`${SHEETS_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? `A Google Sheets API ${response.status} hibát adott.`);
  }

  return response.json();
}

/**
 * Ellenőrzi, hogy a megadott táblázat elérhető-e a szolgáltatásfiókkal.
 * A beállítások mentésekor hívjuk, hogy a hiba azonnal kiderüljön.
 */
export async function checkSpreadsheetAccess(url: string): Promise<SheetResult> {
  if (!isSheetsConfigured()) {
    return { status: "skipped", reason: "Nincs beállítva a Google szolgáltatásfiók a szerveren." };
  }

  const spreadsheetId = spreadsheetIdFromUrl(url);
  if (!spreadsheetId) {
    return { status: "error", message: "Ez nem érvényes Google Sheets link." };
  }

  try {
    await sheetsRequest(`/${spreadsheetId}?fields=spreadsheetId`);
    return { status: "ok" };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Ismeretlen hiba" };
  }
}

/** Ha a táblázat első sora üres, kiírjuk a fejlécet. */
async function ensureHeaderRow(spreadsheetId: string) {
  const range = `A1:${String.fromCharCode(64 + SHEET_COLUMNS.length)}1`;
  const existing = await sheetsRequest(`/${spreadsheetId}/values/${range}`);

  if (!existing.values || existing.values.length === 0) {
    await sheetsRequest(`/${spreadsheetId}/values/${range}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [SHEET_COLUMNS] }),
    });
  }
}

/**
 * Egy jelentkezés hozzáfűzése a táblázathoz. Hibát nem dob: a hívó a
 * visszaadott státuszt jegyzi fel, a jelentkezés a Payloadban marad.
 */
export async function appendApplicationRow(spreadsheetUrl: string | null | undefined, row: ApplicationRow): Promise<SheetResult> {
  if (!spreadsheetUrl?.trim()) {
    return { status: "skipped", reason: "Nincs megadva táblázat a Karrier oldal beállításainál." };
  }

  if (!isSheetsConfigured()) {
    return { status: "skipped", reason: "Nincs beállítva a Google szolgáltatásfiók a szerveren." };
  }

  const spreadsheetId = spreadsheetIdFromUrl(spreadsheetUrl);
  if (!spreadsheetId) {
    return { status: "error", message: "A beállított táblázat linkje nem érvényes." };
  }

  try {
    await ensureHeaderRow(spreadsheetId);

    await sheetsRequest(`/${spreadsheetId}/values/A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({
        values: [
          [
            row.submittedAt,
            row.name,
            row.email,
            row.phone,
            row.university,
            row.major,
            row.semester,
            row.group,
            row.position,
            row.motivation,
          ],
        ],
      }),
    });

    return { status: "ok" };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Ismeretlen hiba" };
  }
}
