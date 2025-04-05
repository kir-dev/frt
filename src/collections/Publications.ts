import { CollectionConfig } from "payload";

export const Publications: CollectionConfig = {
  slug: "publications",
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
    },
    {
      name: "description_eng",
      type: "richText",
      required: true,
      label: "Rövid leírás angolul",
    },
    {
      name: "link",
      type: "text",
      required: true,
      label: "Link a publikációhoz",
    },
  ],
};
