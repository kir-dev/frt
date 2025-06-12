import {CollectionConfig} from "payload";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    description: "Cikkek, hírek és egyéb tartalmak.",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Cím",
    },
    {
      name: "title_eng",
      type: "text",
      required: true,
      label: "Angol Cím",
    },
    {
      name: "short_description",
      type: "richText",
      required: true,
      label: "Rövid Leírás",
    },
    {
      name: "short_description_eng",
      type: "richText",
      required: true,
      label: "Angol Rövid Leírás",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Tartalom",
    },
    {
      name: "content_eng",
      type: "richText",
      required: true,
      label: "Angol Tartalom",
    },
    {
      name: "published_date",
      type: "date",
      required: true,
      label: "Megjelenés Dátuma",
    },
    {
      name: "featured_image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Kiemelt Kép",
    },
    {
      name: "gallery", // This field is an array of images
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
      required: false,
      label: "További Képek",
    },
    {
      name: "category",
      type: "text",
      required: true,
      label: "Kategória neve (pl. „Versenyek”, „Csapatélet”)",
    },
    {
      name: "category_eng",
      type: "text",
      required: true,
      label: "Angol Kategória neve (pl. „Competitions”, „Team Life”)",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "URL-barát azonosító (pl. automatikusan generált a cím alapján)",
        hidden: true,
      },
      hooks: {
        beforeValidate: [({ data, value }) => {
          if (value) return value;
          if (data?.title) {
            // Hungarian accented character replacements
            const accentsMap = {
              'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o',
              'ú': 'u', 'ü': 'u', 'ű': 'u',
              'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ö': 'O', 'Ő': 'O',
              'Ú': 'U', 'Ü': 'U', 'Ű': 'U',
            };
            return data.title
                .toLowerCase()
                .replace(/[áéíóöőúüű]/g, (m: string) => accentsMap[m as keyof typeof accentsMap])
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
          }
          return value;
        }],
      },
    },
  ],
};
