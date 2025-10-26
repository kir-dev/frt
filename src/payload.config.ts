// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { en } from "@payloadcms/translations/languages/en";
import { hu } from "@payloadcms/translations/languages/hu";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Articles } from "./collections/Articles";
import { Events } from "./collections/Events";
import { Cars } from "./collections/Cars";
import { Gallery } from "./collections/Gallery";
import { Publications } from "./collections/Publications";
import { Members } from "./collections/Members";
import { Recruitment } from "./collections/Recruitment";
import { Sponsors } from "@/collections/Sponsors";
import Groups from "@/collections/Groups";
import Association from "@/collections/Association";
import SupportUs from "@/collections/SupportUs";
import Contact from "@/collections/Contact";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const collections = [
      Users,
      Media,
      Articles,
      Events,
      Cars,
      Gallery,
      Publications,
      Members,
      Sponsors,
      Recruitment,
      Groups,
      Association,
      SupportUs,
      Contact,
    ]


export default buildConfig({
    i18n: {
        supportedLanguages: { en, hu },
        fallbackLanguage: "hu",
    },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
