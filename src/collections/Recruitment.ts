import { CollectionConfig } from "payload";
import { FixedToolbarFeature, lexicalEditor} from '@payloadcms/richtext-lexical'; // Ezt importálnod kell!

export const Recruitment: CollectionConfig = {
  slug: "recruitment",
    labels: {
        singular: "Karrier csoport",
        plural: "Karrier csoportok",
    },
  admin: {
    description:
        "A Karrier oldalon megjelenő csoportok és a hozzájuk tartozó pozíciók.",
    useAsTitle: "groupName",
    defaultColumns: ["groupName", "order"],
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
      name: "image",
      type: "upload",
      relationTo: "media",
      required: false,
      label: "Csoport képe",
      admin: {
        description: "A csoport sávjának bal oldalán jelenik meg. Fekvő (kb. 4:3) kép ajánlott.",
      },
    },
    {
      name: "order",
      type: "number",
      required: false,
      label: "Rendezési szám",
      admin: {
        description: "A csoportok növekvő sorrendben jelennek meg. Üresen hagyva a lista végére kerül.",
      },
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
          name: "positionOpen",
          type: "checkbox",
          required: false,
          label: "Nyitott pozíció",
          admin: {
            description: "Csak a bepipált pozíciók jelennek meg a Karrier oldalon.",
          },
        },
        {
          name: "positionDescription",
          type: "richText",
          required: false,
          label: "Pozíció bevezetője",
          admin: {
            description: "Rövid felvezető szöveg, a szekciók fölött jelenik meg. Opcionális.",
          },
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
          required: false,
          label: "Pozíció bevezetője (angolul)",
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
                FixedToolbarFeature(),
            ]
          })
        },
        {
          name: "sections",
          type: "array",
          required: false,
          label: "Leírás szekciói",
          labels: {
            singular: "Szekció",
            plural: "Szekciók",
          },
          admin: {
            description:
                "A pozíció leírása szekciókra bontva, pl. Feladatok, Szükséges skillek, Miben fejlődhetsz, Előnyök.",
          },
          fields: [
            {
              name: "sectionTitle",
              type: "text",
              required: true,
              label: "Szekció címe",
            },
            {
              name: "sectionTitleEng",
              type: "text",
              required: true,
              label: "Szekció címe (angolul)",
            },
            {
              name: "sectionContent",
              type: "richText",
              required: true,
              label: "Szekció tartalma",
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                    FixedToolbarFeature(),
                ]
              })
            },
            {
              name: "sectionContentEng",
              type: "richText",
              required: true,
              label: "Szekció tartalma (angolul)",
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                    FixedToolbarFeature(),
                ]
              })
            },
          ],
        },
        {
          name: "highlights",
          type: "group",
          label: "Kiemelt tudnivalók",
          admin: {
            description: "A pozíció leírása alatt, ikonokkal kiemelve jelennek meg. Az üresen hagyott mezők nem jelennek meg.",
          },
          fields: [
            {
              name: "joining",
              type: "text",
              required: false,
              label: "Csatlakozás",
              admin: {
                description: "Pl. „2. félévtől, gépészmérnök hallgatóknak” vagy „Bármely szakos hallgatónak”.",
              },
            },
            {
              name: "joiningEng",
              type: "text",
              required: false,
              label: "Csatlakozás (angolul)",
            },
            {
              name: "timeCommitment",
              type: "text",
              required: false,
              label: "Időráfordítás",
              admin: {
                description: "Pl. „heti 10-15 óra”.",
              },
            },
            {
              name: "timeCommitmentEng",
              type: "text",
              required: false,
              label: "Időráfordítás (angolul)",
            },
            {
              name: "subsystem",
              type: "text",
              required: false,
              label: "Részegység",
              admin: {
                description: "Pl. „Futómű”, „Akkumulátor”, „Aerodinamika”.",
              },
            },
            {
              name: "subsystemEng",
              type: "text",
              required: false,
              label: "Részegység (angolul)",
            },
          ],
        },
      ],
    },
  ],
};
