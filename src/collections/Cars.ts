import { CollectionConfig } from "payload";

export const Cars: CollectionConfig = {
  slug: "cars",
  admin: {
    description: "Az autók listája részletekkel és képekkel.",
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
      type: "text",
      required: false,
      label: "Interaktív modell link",
    },
  ],
};
