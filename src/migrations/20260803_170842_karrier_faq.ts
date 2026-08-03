import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "career_settings_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "question_eng" varchar NOT NULL,
    "answer" jsonb NOT NULL,
    "answer_eng" jsonb NOT NULL
  );

  ALTER TABLE "career_settings_faqs" ADD CONSTRAINT "career_settings_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "career_settings_faqs_order_idx" ON "career_settings_faqs" USING btree ("_order");
  CREATE INDEX "career_settings_faqs_parent_id_idx" ON "career_settings_faqs" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "career_settings_faqs" CASCADE;`)
}
