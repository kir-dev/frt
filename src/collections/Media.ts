import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // If alt is missing but we have a filename, generate alt from filename
        if (!data.alt && req.file?.name) {
          // Remove file extension and use filename as alt text
          data.alt = req.file.name.split('.').slice(0, -1).join('.') || 'image'
        }
        return data
      },
    ],
  },
  upload: true,
}
