import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "support_us" RENAME COLUMN "button_text" TO "buttontext";
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "support_us" RENAME COLUMN "button_text_en" TO "buttontext_en";
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "support_us" RENAME COLUMN "buttontext" TO "button_text";
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "support_us" RENAME COLUMN "buttontext_en" TO "button_text_en";
    EXCEPTION
      WHEN undefined_column THEN NULL;
    END $$;
  `);
}
