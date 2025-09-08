import { CollectionConfig } from "payload";
import {FixedToolbarFeature, lexicalEditor} from "@payloadcms/richtext-lexical";

export const Cars: CollectionConfig = {
  slug: "cars",
    labels: {
        singular: "Autó",
        plural: "Autók",
    },
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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ]
      })
    },
    {
      name: "description_eng",
      type: "richText",
      required: true,
      label: "Autó rövid leírása angolul",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ]
      })
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
