import { randomUUID } from "node:crypto";
import {
  ApplicationBodyError,
  readApplicationBody,
  validateCV,
} from "@/lib/application-upload";
import {
  resolveFormConfig,
  validateCVPresence,
  validateAnswers,
  summarizeAnswers,
  type CoreKey,
} from "@/lib/career-form";
import { syncApplicationToSheet } from "@/lib/karrier-sheet-sync";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

export const runtime = "nodejs";
const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 5 });
const errorResponse = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request)))
    return errorResponse("TOO_MANY_REQUESTS", 429);
  let cvId: number | undefined;
  const payload = await getPayload({ config });
  try {
    const { body, cv } = await readApplicationBody(request);
    if (typeof body.website === "string" && body.website.trim())
      return NextResponse.json({ ok: true });
    const settings = await payload.findGlobal({ slug: "career-settings" });
    if (
      settings.applicationsOpen === false ||
      settings.applicationMode === "googleForm"
    )
      return errorResponse("APPLICATIONS_CLOSED", 403);
    const formConfig = resolveFormConfig(settings);
    if (
      body.formVersion !== undefined &&
      body.formVersion !== formConfig.version
    )
      return NextResponse.json(
        { error: "FORM_CHANGED", config: formConfig },
        { status: 409 },
      );
    const input = body.answers ?? body;
    if (!input || typeof input !== "object" || Array.isArray(input))
      return errorResponse("INVALID_BODY", 400);
    const parsed = validateAnswers(
      input as Record<string, unknown>,
      formConfig,
    );
    if (!parsed.ok)
      return NextResponse.json(
        { error: parsed.error, field: parsed.field },
        { status: 400 },
      );
    const cvPresence = validateCVPresence(!!cv, formConfig);
    if (cvPresence !== true)
      return NextResponse.json(
        { error: cvPresence, field: "cv" },
        { status: 400 },
      );
    const language = body.language === "en" ? "en" : "hu";
    if (cv) {
      const bytes = await validateCV(cv);
      const uploaded = await payload.create({
        collection: "application-cvs",
        overrideAccess: true,
        data: {},
        file: {
          data: bytes,
          name: `${randomUUID()}.pdf`,
          mimetype: "application/pdf",
          size: bytes.length,
        },
      });
      cvId = uploaded.id;
    }
    const textValue = (key: CoreKey) =>
      typeof parsed.values[key] === "string"
        ? (parsed.values[key] as string)
        : "";
    const doc = await payload.create({
      collection: "job-applications",
      overrideAccess: true,
      context: { skipSheetSync: true },
      data: {
        name: textValue("name"),
        email: textValue("email"),
        phone: textValue("phone"),
        university: textValue("university"),
        major: textValue("major"),
        semester: textValue("semester"),
        groupName: textValue("groupName"),
        positionName: textValue("positionName"),
        motivation: textValue("motivation"),
        consent: true,
        cv: cvId,
        language,
        formVersion: formConfig.version,
        answerSnapshot: parsed.snapshots,
        answerSummary: summarizeAnswers(
          parsed.snapshots,
          language === "en",
          true,
        ),
      },
    });
    // The application and file are committed before contacting the external spreadsheet.
    cvId = undefined;
    await syncApplicationToSheet(payload, doc);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (cvId) {
      try {
        await payload.delete({
          collection: "application-cvs",
          id: cvId,
          overrideAccess: true,
        });
      } catch (cleanupError) {
        payload.logger.error(
          {
            errorType:
              cleanupError instanceof Error ? cleanupError.name : "unknown",
            cvId,
          },
          "Árva önéletrajz takarítása sikertelen",
        );
      }
    }
    if (error instanceof ApplicationBodyError)
      return errorResponse(error.code, error.status);
    payload.logger.error(
      { errorType: error instanceof Error ? error.name : "unknown" },
      "Jelentkezés mentése sikertelen",
    );
    return errorResponse("SERVER_ERROR", 500);
  }
}
