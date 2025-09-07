// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

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
import {s3Storage} from "@payloadcms/storage-s3";
import Association from "@/collections/Association";
import SupportUs from "@/collections/SupportUs";

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
    ]


export default buildConfig({
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
    s3Storage({
      collections: {
          media: true
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        // ... Other S3 configuration
      },
    }),
    // storage-adapter-placeholder
  ],
});
