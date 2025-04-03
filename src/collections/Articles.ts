import { CollectionConfig } from "payload";

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
  ],
};
