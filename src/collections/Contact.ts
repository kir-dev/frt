import { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

const Contact: CollectionConfig = {
  slug: "contact",
  admin: {
    useAsTitle: "title",
    description: "A kapcsolat oldal szerkeszthető tartalma",
  },
  labels: {
    singular: "Kapcsolat",
    plural: "Kapcsolat",
  },
  access: {
    create: async ({ req: { user, payload } }) => {
      if (!user) return false;
      const docs = await payload.find({ collection: "contact", limit: 1 });
      return docs.totalDocs === 0;
    },
    update: ({ req: { user } }) => !!user,
    delete: () => false,
    read: () => true,
  },
  fields: [
    {
      name: "exhibitionUrl",
      type: "text",
      label: "Kiállítási igény – űrlap linkje",
      defaultValue:
        "https://docs.google.com/forms/d/e/1FAIpQLSdrA3VX3YpxQB3uZ1ojXov8-J3LPawAt4ip_Aj4k8FNbNOCrA/viewform?usp=dialog",
      admin: { description: "Üresen hagyva a gomb nem jelenik meg." },
      validate: (value: string | null | undefined) => {
        if (!value?.trim()) return true;
        try {
          const url = new URL(value);
          return url.protocol === "https:" && !url.username && !url.password
            ? true
            : "HTTPS link szükséges.";
        } catch {
          return "Érvényes HTTPS link szükséges.";
        }
      },
    },
    {
      name: "exhibitionLabel",
      type: "text",
      label: "Kiállítási gomb felirata",
      defaultValue: "Rendezvényen való kiállítási igény",
    },
    {
      name: "exhibitionLabelEng",
      type: "text",
      label: "Kiállítási gomb felirata (angol)",
      defaultValue: "Event Exhibition Request",
    },
    {
      name: "title",
      type: "text",
      label: "Cím",
      required: true,
    },
    {
      name: "title_en",
      type: "text",
      label: "Cím (angol)",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      label: "Tartalom",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "content_en",
      type: "richText",
      label: "Tartalom (angol)",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
  ],
};

export default Contact;
