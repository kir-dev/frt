import {CollectionConfig} from "payload";

export const Sponsors: CollectionConfig = {
    slug: "sponsors",
    labels: {
        singular: "Támogató",
        plural: "Támogatók",
    },
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
            type: "select",
            options: [
                {
                    label: "Gyémánt",
                    value: "diamond"
                }, {
                    label: "Arany",
                    value: "gold"
                },
                {
                    label: "Ezüst",
                    value: "silver"
                },
                {
                    label: "Bronz",
                    value: "copper"
                },
                {
                    label: "További",
                    value: "other"
                },
                {
                    label: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
                    value: "bme"
                }
            ],
            required: true,
            label: "Támogatói fokozat",
        }
    ]
};
