import {CollectionConfig, getPayload} from 'payload';
import config from "@payload-config";

const Association: CollectionConfig = {
  slug: 'association',
  admin: {
    useAsTitle: 'title',
    description: 'Az egyesület szerkeszthető tartalmai',
  },
  access: {
    create: async ({}) => {
      const payload = await getPayload({ config })
      const docs = await payload.find({ collection: 'association', limit: 1 });
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
    },
    {
        name: 'content_en',
        type: 'richText',
        label: 'Tartalom (angol)',
        required: true,
    },
  ],
};

export default Association;

