import { syncApplicationToSheet } from "@/lib/karrier-sheet-sync";
import type { CollectionAfterChangeHook, CollectionConfig, PayloadHandler } from "payload";

/** Új jelentkezés automatikus kiírása a beállított Google táblázatba. */
const syncOnCreate: CollectionAfterChangeHook = async ({ doc, operation, req, context }) => {
  if (operation !== "create" || context?.skipSheetSync) {
    return doc;
  }

  await syncApplicationToSheet(req.payload, doc, req);
  return doc;
};

/**
 * Kézi újraküldés az adminból: a beállítás előtt vagy hiba miatt kimaradt
 * jelentkezéseket utólag is ki lehet írni a táblázatba.
 */
const resyncHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const id = req.routeParams?.id;
  if (!id) {
    return Response.json({ error: "MISSING_ID" }, { status: 400 });
  }

  const doc = await req.payload.findByID({
    collection: "job-applications",
    id: String(id),
    overrideAccess: true,
  });

  const result = await syncApplicationToSheet(req.payload, doc);

  return Response.json(result, { status: result.status === "error" ? 502 : 200 });
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
      label: "Google táblázat",
      options: [
        { label: "Kiírva", value: "ok" },
        { label: "Kihagyva", value: "skipped" },
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
      label: "Részletek",
      admin: {
        readOnly: true,
        position: "sidebar",
        condition: (_, siblingData) => Boolean(siblingData?.sheetSyncError),
      },
    },
    {
      name: "resyncToSheet",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "/components/payload/ResyncSheetButton#ResyncSheetButton",
        },
      },
    },
  ],
  endpoints: [
    {
      path: "/:id/resync",
      method: "post",
      handler: resyncHandler,
    },
  ],
  hooks: {
    afterChange: [syncOnCreate],
  },
};
