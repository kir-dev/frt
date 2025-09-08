import { CollectionConfig } from "payload";
import {FixedToolbarFeature, lexicalEditor} from "@payloadcms/richtext-lexical";

export const Publications: CollectionConfig = {
  slug: "publications",
    labels: {
        singular: "Publikáció",
        plural: "Publikációk",
    },
  admin: {
    useAsTitle: "title",
    description:
      "Csapattagok által készített kutatási publikációk és szakdolgozatok tárolása.",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Publikáció címe",
    },
    {
      name: "title_eng",
      type: "text",
      required: true,
      label: "Publikáció címe angolul",
    },
    {
      name: "author",
      type: "text",
      required: true,
      label: "Szerző neve",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Rövid leírás",
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
      label: "Rövid leírás angolul",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ]
      })
    },
    {
      name: "link",
      type: "text",
      required: true,
      label: "Link a publikációhoz",
    },
  ],
};
