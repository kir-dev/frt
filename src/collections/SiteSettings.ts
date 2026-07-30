import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: {
    en: 'Site Settings',
    hu: 'Oldal beállítások',
  },
  access: {
    read: () => true, // Everyone can read settings
    update: ({ req: { user } }) => !!user, // Only authenticated users can update
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Page Visibility',
            hu: 'Oldal láthatóság',
          },
          fields: [
            {
              name: 'showAssociationPage',
              type: 'checkbox',
              label: {
                en: 'Show Association Page',
                hu: 'Egyesület oldal megjelenítése',
              },
              defaultValue: true,
              admin: {
                description: {
                  en: 'Controls visibility of the Association page in navigation and direct access',
                  hu: 'Az Egyesület oldal láthatóságát szabályozza a navigációban és közvetlen hozzáférésben',
                },
              },
            },
            {
              name: 'showRecruitmentPage',
              type: 'checkbox',
              label: {
                en: 'Show Careers Page',
                hu: 'Karrier oldal megjelenítése',
              },
              defaultValue: true,
              admin: {
                description: {
                  en: 'Controls visibility of the Careers page in navigation and direct access',
                  hu: 'A Karrier oldal láthatóságát szabályozza a navigációban és közvetlen hozzáférésben',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
