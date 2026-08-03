import { checkSpreadsheetAccess, serviceAccountEmail } from "@/lib/google-sheets";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";

const spreadsheetHelp = () => {
  const email = serviceAccountEmail();

  return email
      ? `Illeszd be a Google táblázat linkjét, és oszd meg a táblázatot Szerkesztő jogosultsággal ezzel a címmel: ${email} — a fejlécsort automatikusan létrehozzuk. Üresen hagyva a jelentkezések csak ide, az adminba érkeznek.`
      : "A táblázatba írás nincs beállítva a szerveren (hiányzik a Google szolgáltatásfiók). Szólj a fejlesztőknek, addig a jelentkezések csak ide, az adminba érkeznek.";
};

export const CareerSettings: GlobalConfig = {
  slug: "career-settings",
  label: {
    en: "Career page",
    hu: "Karrier oldal",
  },
  admin: {
    description:
        "A Karrier oldal bevezetője és a jelentkezés módjának beállítása.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: {
            en: "Intro",
            hu: "Bevezető",
          },
          fields: [
            {
              name: "intro",
              type: "richText",
              required: false,
              label: "Általános leírás",
              admin: {
                description: "Az oldal tetején, a csoportok listája fölött jelenik meg.",
              },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                ],
              }),
            },
            {
              name: "introEng",
              type: "richText",
              required: false,
              label: "Általános leírás (angolul)",
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: {
            en: "Application",
            hu: "Jelentkezés",
          },
          fields: [
            {
              name: "applicationMode",
              type: "select",
              required: false,
              defaultValue: "builtIn",
              label: "Jelentkezés módja",
              options: [
                { label: "Beépített űrlap az oldal alján", value: "builtIn" },
                { label: "Külső Google űrlap", value: "googleForm" },
              ],
              admin: {
                description:
                    "Beépített űrlap esetén a jelentkezések a Payload adminba érkeznek (és a Google táblázatba, ha be van állítva a webhook).",
              },
            },
            {
              name: "googleFormUrl",
              type: "text",
              required: false,
              label: "Google űrlap linkje",
              admin: {
                description: "Csak a „Külső Google űrlap” mód esetén használjuk.",
                condition: (data) => data?.applicationMode === "googleForm",
              },
            },
            {
              name: "spreadsheetUrl",
              type: "text",
              required: false,
              label: "Google táblázat linkje",
              admin: {
                description: spreadsheetHelp,
                condition: (data) => data?.applicationMode !== "googleForm",
              },
              // Mentéskor rögtön kiderül, ha a táblázat nincs megosztva velünk.
              validate: async (value: string | null | undefined) => {
                if (!value?.trim()) return true

                const result = await checkSpreadsheetAccess(value)

                if (result.status === "error") {
                  return `A táblázat nem érhető el: ${result.message}. Ellenőrizd a linket, és hogy megosztottad-e Szerkesztő jogosultsággal.`
                }

                return true
              },
            },
            {
              name: "applicationsOpen",
              type: "checkbox",
              defaultValue: true,
              label: "Jelentkezés nyitva",
              admin: {
                description:
                    "Kikapcsolva az oldal továbbra is elérhető, de a jelentkezési űrlap és a „Jelentkezz” gomb helyett egy tájékoztató szöveg jelenik meg.",
              },
            },
            {
              name: "applicationsClosedText",
              type: "text",
              required: false,
              label: "Szöveg zárt jelentkezés esetén",
              admin: {
                condition: (data) => data?.applicationsOpen === false,
              },
            },
            {
              name: "applicationsClosedTextEng",
              type: "text",
              required: false,
              label: "Szöveg zárt jelentkezés esetén (angolul)",
              admin: {
                condition: (data) => data?.applicationsOpen === false,
              },
            },
          ],
        },
        {
          label: {
            en: "FAQ",
            hu: "GYIK",
          },
          fields: [
            {
              name: "faqs",
              type: "array",
              required: false,
              label: "Gyakran ismételt kérdések",
              labels: {
                singular: "Kérdés és válasz",
                plural: "Kérdések és válaszok",
              },
              admin: {
                description:
                    "A kérdések ebben a sorrendben jelennek meg a Karrier oldal alján. Üresen hagyva a GYIK szekció nem jelenik meg.",
              },
              fields: [
                {
                  name: "question",
                  type: "text",
                  required: true,
                  label: "Kérdés",
                },
                {
                  name: "questionEng",
                  type: "text",
                  required: true,
                  label: "Kérdés (angolul)",
                },
                {
                  name: "answer",
                  type: "richText",
                  required: true,
                  label: "Válasz",
                  editor: lexicalEditor({
                    features: ({ defaultFeatures }) => [
                      ...defaultFeatures,
                      FixedToolbarFeature(),
                    ],
                  }),
                },
                {
                  name: "answerEng",
                  type: "richText",
                  required: true,
                  label: "Válasz (angolul)",
                  editor: lexicalEditor({
                    features: ({ defaultFeatures }) => [
                      ...defaultFeatures,
                      FixedToolbarFeature(),
                    ],
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
