// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { hu } from "@payloadcms/translations/languages/hu";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Articles } from "./collections/Articles";
import Association from "./collections/Association";
import { Cars } from "./collections/Cars";
import Contact from "./collections/Contact";
import { Events } from "./collections/Events";
import { Gallery } from "./collections/Gallery";
import Groups from "./collections/Groups";
import { Media } from "./collections/Media";
import { Members } from "./collections/Members";
import { Publications } from "./collections/Publications";
import { Recruitment } from "./collections/Recruitment";
import { Sponsors } from "./collections/Sponsors";
import SupportUs from "./collections/SupportUs";
import { Users } from "./collections/Users";

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
