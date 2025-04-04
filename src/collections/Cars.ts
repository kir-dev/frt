import { CollectionConfig } from "payload";

export const Cars: CollectionConfig = {
  slug: "cars",
  admin: {
    description: "Az autó leírása részletekkel és képekkel.",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Autó neve",
    },
    {
      name: "year",
      type: "number",
      required: true,
      label: "Gyártási év",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Autó rövid leírása",
    },
    {
      name: "description_eng",
      type: "richText",
      required: true,
      label: "Autó rövid leírása angolul",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Autó képe",
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
      required: true,
      label: "További képek",
    },
    {
      name: "interactive_model",
      type: "upload",
      relationTo: "media",
      required: false,
      label: "Interaktív modell link",
    },
  ],
};
