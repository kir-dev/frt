import { CollectionConfig } from "payload";

export const Gallery: CollectionConfig = {
  slug: "gallery",
  labels: {
    singular: "Galéria",
    plural: "Galéria",
  },
  admin: {
    description: "Képek kategorizálása albumokba",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Album címe",
    },
    {
      name: "title_eng",
      type: "text",
      required: false,
      label: "Album címe angolul",
    },
    {
      name: "date",
      type: "date",
      required: true,
      label: "Album dátuma",
    },
    {
      name: "category",
      type: "text",
      required: false,
      label: "Kategória neve (pl. „Versenyek”, „Csapatélet”)",
    },
    {
      name: "images", // This field is an array of images
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
      required: true,
      label: "Képek",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description:
          "URL-barát azonosító, automatikusan generált a cím alapján",
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
