import {CollectionConfig} from "payload";

export const Sponsors: CollectionConfig = {
    slug: "sponsors",
    admin: {
        description: "Támogató adatai",
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            label: "Név",
        },
        {
            name: "logo",
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: "Logo",
        },
        {
            name: "website",
            type: "text",
            required: true,
            label: "Link a támogató oldalához",
        },
        {
            name: "tier",
            type: "text",
            required: true,
            label: "Támogatói fokozat",
        }
    ]
};
