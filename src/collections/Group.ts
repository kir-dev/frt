import { CollectionConfig } from "payload";

export const Group: CollectionConfig = {
  slug: "csoport",
  admin: {
    description: "Csoportok, amelyekhez tagokat lehet rendelni.",
    useAsTitle: "nev",
  },
  fields: [
    {
      name: "nev",
      type: "text",
      label: "Csoport neve",
      required: true,
    },
    {
      name: "name_en",
      type: "text",
      label: "Group name (English)",
      required: true,
    },
    {
      name: "leiras",
      type: "textarea",
      label: "Leírás",
      required: true,
    },
    {
      name: "description_en",
      type: "textarea",
      label: "Description (English)",
      required: true,
    },
    {
      name: "members",
      type: "relationship",
      relationTo: "members",
      hasMany: true,
      label: "Tagok",
    },
  ],
};

