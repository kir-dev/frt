import { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

export const Events: CollectionConfig = {
  slug: "events",
    labels: {
        singular: "Esemény",
        plural: "Események",
    },
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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "description_eng",
      type: "richText",
      required: true,
      label: "Esemény angol leírása",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
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
    {
      name: "facebookEventLink",
      type: "text",
      required: false,
      label: "Facebook Event Link",
    },
    {
      name: "linkToPictureFromEvent",
      type: "relationship",
      relationTo: "gallery",
      required: false,
      label: "Link a galériához",
      admin: {
        description: "Ha van galéria az eseményről, ide linkelheted be",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "URL-barát azonosító, automatikusan generált",
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          async ({ data, value, req }) => {
            const formatSlug = (val: string) => {
              const accentsMap: { [key: string]: string } = {
                á: "a",
                é: "e",
                í: "i",
                ó: "o",
                ö: "o",
                ő: "o",
                ú: "u",
                ü: "u",
                ű: "u",
                Á: "A",
                É: "E",
                Í: "I",
                Ó: "O",
                Ö: "O",
                Ő: "O",
                Ú: "U",
                Ü: "U",
                Ű: "U",
              };
              return val
                .toLowerCase()
                .replace(
                  /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g,
                  (m: string) => accentsMap[m] || m,
                )
                .replace(/[^a-z0-9-]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            };

            let slug = value;

            if (slug) {
              slug = formatSlug(slug);
            } else if (data?.title) {
              slug = formatSlug(data.title);
            }

            if (slug) {
              try {
                const existingEvent = await req.payload.find({
                  collection: "events",
                  where: {
                    slug: {
                      equals: slug,
                    },
                  },
                  limit: 1,
                });

                if (existingEvent.docs.length > 0) {
                  const date = new Date();
                  const dateString = `-${date.getFullYear()}-${
                    date.getMonth() + 1
                  }-${date.getDate()}`;
                  return `${slug}${dateString}`;
                }
              } catch (e) {
                req.payload.logger.error(
                  `Error checking for existing slug in Events collection: ${e}`,
                );
              }
            }

            return slug;
          },
        ],
      },
    },
  ],
};
