import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "show_association_page" boolean DEFAULT true,
      "show_recruitment_page" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
    
    -- Insert initial record if table is empty
    INSERT INTO "site_settings" ("show_association_page", "show_recruitment_page")
    SELECT true, true
    WHERE NOT EXISTS (SELECT 1 FROM "site_settings");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings";
  `);
}
