import { sendApplicationToSheet } from "@/lib/google-sheets";
import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

/**
 * Új jelentkezés kiírása a Google Sheets táblázatba, majd a szinkron
 * eredményének visszaírása a dokumentumra. A hiba sosem bukik ki a hívóhoz:
 * a jelentkezés a Payloadban akkor is elmentve marad.
 */
const syncToGoogleSheet: CollectionAfterChangeHook = async ({ doc, operation, req, context }) => {
  if (operation !== "create" || context?.skipSheetSync) {
    return doc;
  }

  const result = await sendApplicationToSheet({
    id: doc.id,
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
    req.payload.logger.error(
        `A(z) #${doc.id} jelentkezés Google Sheets szinkronizálása sikertelen: ${result.message}`,
    );
  }

  try {
    await req.payload.update({
      collection: "job-applications",
      id: doc.id,
      data: {
        sheetSyncStatus: result.status,
        sheetSyncError: result.status === "error" ? result.message : null,
      },
      overrideAccess: true,
      // A create tranzakciójában vagyunk — req nélkül a friss sor még nem látszana.
      req,
      context: { skipSheetSync: true },
    });
  } catch (error) {
    req.payload.logger.error(
        `A(z) #${doc.id} jelentkezés szinkron-státuszának mentése sikertelen: ${error}`,
    );
  }

  return doc;
};

export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  labels: {
    singular: "Jelentkezés",
    plural: "Jelentkezések",
  },
  admin: {
    description: "A Karrier oldalon beérkezett jelentkezések.",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "positionName", "groupName", "createdAt"],
  },
  access: {
    // Létrehozás kizárólag a szerveroldali API route-on keresztül (overrideAccess),
    // hogy a nyilvános REST végponton ne lehessen közvetlenül beküldeni.
    create: () => false,
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Név",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "E-mail cím",
    },
    {
      name: "phone",
      type: "text",
      required: false,
      label: "Telefonszám",
    },
    {
      name: "university",
      type: "text",
      required: false,
      label: "Egyetem / kar",
    },
    {
      name: "major",
      type: "text",
      required: false,
      label: "Szak",
    },
    {
      name: "semester",
      type: "text",
      required: false,
      label: "Hányadik félév",
    },
    {
      name: "groupName",
      type: "text",
      required: false,
      label: "Megpályázott csoport",
    },
    {
      name: "positionName",
      type: "text",
      required: false,
      label: "Megpályázott pozíció",
    },
    {
      name: "motivation",
      type: "textarea",
      required: false,
      label: "Motiváció / üzenet",
    },
    {
      name: "consent",
      type: "checkbox",
      required: false,
      label: "Adatkezelési hozzájárulás",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "sheetSyncStatus",
      type: "select",
      required: false,
      label: "Google Sheets szinkron",
      options: [
        { label: "Kiírva", value: "ok" },
        { label: "Kihagyva (nincs webhook beállítva)", value: "skipped" },
        { label: "Hiba", value: "error" },
      ],
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "sheetSyncError",
      type: "text",
      required: false,
      label: "Szinkron hibaüzenete",
      admin: {
        readOnly: true,
        position: "sidebar",
        condition: (data) => data?.sheetSyncStatus === "error",
      },
    },
  ],
  hooks: {
    afterChange: [syncToGoogleSheet],
  },
};
