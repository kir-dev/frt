import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "formula_student" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "title_en" varchar NOT NULL,
      "content" jsonb NOT NULL,
      "content_en" jsonb NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS "formula_student_created_at_idx" ON "formula_student" ("created_at");
    CREATE INDEX IF NOT EXISTS "formula_student_updated_at_idx" ON "formula_student" ("updated_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "formula_student";
  `);
}
