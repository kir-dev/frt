import config from "@payload-config";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig, getPayload } from 'payload';

const SupportUs: CollectionConfig = {
    slug: 'support-us',
    admin: {
        useAsTitle: 'title',
        description: 'A támogass mink oldal szerkeszthető tartalma',
    },
    labels: {
        singular: 'Támogass minket',
        plural: 'Támogass minket',
    },
    access: {
        create: async ({}) => {
            const payload = await getPayload({ config })
            const docs = await payload.find({ collection: 'support-us', limit: 1 });
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
            name: 'button_text',
            type: 'text',
            label: 'Gomb szöveg',
            defaultValue: 'Támogatom a csapatot',
            required: true,
        },
        {
            name: 'button_text_en',
            type: 'text',
            label: 'Gomb szöveg (angol)',
            defaultValue: 'Support the team',
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

export default SupportUs;
