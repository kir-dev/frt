import { CollectionConfig } from "payload";
import { FixedToolbarFeature, lexicalEditor} from '@payloadcms/richtext-lexical'; // Ezt importálnod kell!

export const Recruitment: CollectionConfig = {
  slug: "recruitment",
  admin: {
    description:
        "Nyitott pozíciók a csoportokon belül, funkcionális területek szerint csoportosítva.",
    useAsTitle: "groupName",
  },
  fields: [
    {
      name: "groupName",
      type: "text",
      required: true,
      label: "Csoport neve",
    },
    {
      name: "groupNameEng",
      type: "text",
      required: true,
      label: "Csoport neve angolul",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Csoport leírása",
      // Itt adhatod hozzá az editor konfigurációt
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ]
      })
    },
    {
      name: "descriptionEng",
      type: "richText",
      required: true,
      label: "Csoport leírása angolul",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
            FixedToolbarFeature(),
        ]
      })
    },
    {
      name: "positions",
      type: "array",
      required: true,
      label: "Pozíciók",
      fields: [
        {
          name: "positionName",
          type: "text",
          required: true,
          label: "Pozíció neve",
        },
        {
          name: "positionNameEng",
          type: "text",
          required: true,
          label: "Pozíció neve (angolul)",
        },
        {
          name: "positionDescription",
          type: "richText",
          required: true,
          label: "Pozíció leírása",
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
                FixedToolbarFeature(),
            ]
          })
        },
        {
          name: "positionDescriptionEng",
          type: "richText",
          required: true,
          label: "Pozíció leírása (angolul)",
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
                FixedToolbarFeature(),
            ]
          })
        },
        {
          name: "positionOpen",
          type: "checkbox",
          required: true,
          label: "Nyitott pozíció",
        },
      ],
    },
  ],
};