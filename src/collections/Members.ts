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
      type: "select",
      options: [
        {
          label: "Vezetőség",
          value: "vezetoseg",
        },
        {
          label: "Mechanikai csoport",
          value: "mechanikai_csoport",
        },
        {
          label: "Elektronika csoport",
          value: "elektronika_csoport",
        },
        {
          label: "Járműdinamika csoport",
          value: "jarmudinamika_csoport",
        },
        {
          label: "Aerodinamika csoport",
          value: "aerodinamika_csoport",
        },
        {
          label: "Váz csoport",
          value: "vaz_csoport",
        },
        {
          label: "Operatív csoport",
          value: "operativ_csoport",
        },
        {
          label: "Elektromos hajtáslánc csoport",
          value: "elektromos_hajtaslanc_csoport",
        },
        {
          label: "Driverless csoport",
          value: "driverless_csoport",
        },
        {
          label: "Szponzorációs csoport",
          value: "szponzoracios_csoport",
        },
      ],
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
