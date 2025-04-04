import { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    description: "Események és programok",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Esemény neve",
    },
    {
      name: "title_eng",
      type: "text",
      required: true,
      label: "Esemény angol neve",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Esemény leírása",
    },
    {
      name: "description_eng",
      type: "richText",
      required: true,
      label: "Esemény angol leírása",
    },
    {
      name: "start_date",
      type: "date",
      required: true,
      label: "Esemény kezdete",
    },
    {
      name: "end_date", //Only if multi-day event
      type: "date",
      required: false,
      label: "Esemény vége (csak ha többnapos)",
    },
    {
      name: "location",
      type: "text",
      required: true,
      label: "Helyszín",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Kép",
    },
  ],
};
