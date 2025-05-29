import { CollectionConfig } from "payload";

export const Members: CollectionConfig = {
  slug: "members",
  admin: {
    description: "Csapattagok profiljai, a hozzájuk tartozó csoport és kép.",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Név",
      required: true,
    },
    {
      name: "group",
      type: "relationship",
      relationTo: "groups",
      required: true,
      label: "Csoport",
    },
    {
      name: "position",
      type: "text",
      required: false,
      label: "Pozíció",
    },
    {
      name: "picture",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Profilkép",
    },
  ],
};
