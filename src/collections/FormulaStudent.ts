import config from "@payload-config";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig, getPayload } from 'payload';

const FormulaStudent: CollectionConfig = {
  slug: 'formula-student',
    labels: {
        singular: 'Formula Student',
        plural: 'Formula Student',
    },
  admin: {
    useAsTitle: 'title',
    description: 'A Formula Student oldal szerkeszthető tartalmai',
  },
  access: {
    create: async ({}) => {
      const payload = await getPayload({ config })
      const docs = await payload.find({ collection: 'formula-student', limit: 1 });
      return docs.totalDocs === 0;
    },
    update: () => true,
    delete: () => false,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Cím',
      required: true,
    },
    {
        name: 'title_en',
        type: 'text',
        label: 'Cím (angol)',
        required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Tartalom',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ]
      })
    },
    {
        name: 'content_en',
        type: 'richText',
        label: 'Tartalom (angol)',
        required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ]
      })
    },
  ],
};

export default FormulaStudent;
