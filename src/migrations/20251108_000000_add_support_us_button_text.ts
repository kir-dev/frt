import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "support_us"
    ADD COLUMN IF NOT EXISTS "button_text" varchar DEFAULT 'Támogatom a csapatot' NOT NULL,
    ADD COLUMN IF NOT EXISTS "button_text_en" varchar DEFAULT 'Support the team' NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "support_us"
    DROP COLUMN IF EXISTS "button_text",
    DROP COLUMN IF EXISTS "button_text_en";
  `);
}
