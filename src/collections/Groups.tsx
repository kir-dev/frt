import { CollectionConfig } from "payload";
import {FixedToolbarFeature, lexicalEditor} from "@payloadcms/richtext-lexical";

const Group: CollectionConfig = {
  slug: "groups",
  labels: {
    singular: "Group",
    plural: "Groups",
  },
    admin: {
        description: "Csoportok, amelyek a csapattagokat tartalmazzák.",
        useAsTitle: "name",
    },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      name: "nameEn",
      type: "text",
      label: "Name (English)",
      required: true,
    },
      {
          name: "description",
          type: "richText",
          required: true,
          label: "Csoport leírása",
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
  ],
};

export default Group;