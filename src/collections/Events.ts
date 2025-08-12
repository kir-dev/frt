import { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    description: "Események és programok",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Esemény neve",
    },
    {
      name: "title_eng",
      type: "text",
      required: true,
      label: "Esemény angol neve",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Esemény leírása",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "description_eng",
      type: "richText",
      required: true,
      label: "Esemény angol leírása",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "start_date",
      type: "date",
      required: true,
      label: "Esemény kezdete",
    },
    {
      name: "end_date", //Only if multi-day event
      type: "date",
      required: false,
      label: "Esemény vége (csak ha többnapos)",
    },
    {
      name: "location",
      type: "text",
      required: true,
      label: "Helyszín",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Kép",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "URL-barát azonosító, automatikusan generált",
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (value) return value;
            if (data?.title) {
              // Hungarian accented character replacements
              const accentsMap = {
                á: "a",
                é: "e",
                í: "i",
                ó: "o",
                ö: "o",
                ő: "o",
                ú: "u",
                ü: "u",
                ű: "u",
                Á: "A",
                É: "E",
                Í: "I",
                Ó: "O",
                Ö: "O",
                Ő: "O",
                Ú: "U",
                Ü: "U",
                Ű: "U",
              };
              return data.title
                .toLowerCase()
                .replace(
                  /[áéíóöőúüű]/g,
                  (m: string) => accentsMap[m as keyof typeof accentsMap],
                )
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            }
            return value;
          },
        ],
      },
    },
  ],
};
