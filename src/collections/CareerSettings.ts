import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";

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
      ],
    },
  ],
};
