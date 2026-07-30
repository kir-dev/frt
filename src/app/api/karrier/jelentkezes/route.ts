import { parseApplicationInput } from "@/lib/karrier-application";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

/**
 * A Karrier oldal beépített jelentkezési űrlapjának végpontja.
 *
 * A job-applications kollekció create jogosultsága zárt, ezért a beszúrás
 * innen, overrideAccess-szel történik — így a nyilvános Payload REST végponton
 * nem lehet közvetlenül jelentkezést létrehozni.
 */

const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 5 });

const errorResponse = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return errorResponse("TOO_MANY_REQUESTS", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_BODY", 400);
  }

  const parsed = parseApplicationInput(body);

  if (!parsed.ok) {
    // A botnak sikeres választ adunk, hogy ne tudja kitalálni a csapdát.
    return parsed.error === "HONEYPOT"
        ? NextResponse.json({ ok: true })
        : errorResponse(parsed.error, 400);
  }

  try {
    const payload = await getPayload({ config });

    const settings = await payload.findGlobal({ slug: "career-settings" });
    if (settings?.applicationsOpen === false) {
      return errorResponse("APPLICATIONS_CLOSED", 403);
    }

    await payload.create({
      collection: "job-applications",
      overrideAccess: true,
      data: parsed.data,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Jelentkezés mentése sikertelen:", error);
    return errorResponse("SERVER_ERROR", 500);
  }
}
