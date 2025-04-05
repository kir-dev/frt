import { CollectionConfig } from "payload";

export const Gallery: CollectionConfig = {
  slug: "gallery",
  labels: {
    singular: "Gallery",
    plural: "Gallery",
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
  ],
};
