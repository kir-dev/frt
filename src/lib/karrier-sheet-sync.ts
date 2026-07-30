import type { JobApplication } from "@/payload-types";
import type { Payload, PayloadRequest } from "payload";
import { appendApplicationRow, type SheetResult } from "./google-sheets";

/**
 * Egy jelentkezés kiírása a Karrier oldal beállításainál megadott Google
 * táblázatba, majd az eredmény visszaírása a jelentkezésre.
 *
 * Sosem dob hibát: a jelentkezés a Payloadban akkor is elmentve marad, ha a
 * táblázat épp nem elérhető — a státusz az adminban látszik.
 */
export async function syncApplicationToSheet(
    payload: Payload,
    doc: JobApplication,
    req?: PayloadRequest,
): Promise<SheetResult> {
  const settings = await payload.findGlobal({ slug: "career-settings" });

  const result = await appendApplicationRow(settings?.spreadsheetUrl, {
    submittedAt: doc.createdAt,
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? "",
    university: doc.university ?? "",
    major: doc.major ?? "",
    semester: doc.semester ?? "",
    group: doc.groupName ?? "",
    position: doc.positionName ?? "",
    motivation: doc.motivation ?? "",
  });

  if (result.status === "error") {
    payload.logger.error(`A(z) #${doc.id} jelentkezés kiírása a táblázatba sikertelen: ${result.message}`);
  }

  const detail = result.status === "error" ? result.message : result.status === "skipped" ? result.reason : null;

  try {
    await payload.update({
      collection: "job-applications",
      id: doc.id,
      data: { sheetSyncStatus: result.status, sheetSyncError: detail },
      overrideAccess: true,
      // Create közben tranzakcióban vagyunk — req nélkül a friss sor még nem látszana.
      req,
      context: { skipSheetSync: true },
    });
  } catch (error) {
    payload.logger.error(`A(z) #${doc.id} jelentkezés szinkron-státuszának mentése sikertelen: ${error}`);
  }

  return result;
}
