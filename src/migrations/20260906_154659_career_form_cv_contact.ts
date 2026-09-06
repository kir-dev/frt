import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_applications_language" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_career_settings_form_questions_type" AS ENUM('text', 'textarea', 'select', 'multiselect', 'checkbox');
  CREATE TABLE "application_cvs" (
    "id" serial PRIMARY KEY NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric
  );

  CREATE TABLE "career_settings_form_questions_options" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar,
    "label" varchar,
    "label_eng" varchar
  );

  CREATE TABLE "career_settings_form_questions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "label" varchar NOT NULL,
    "label_eng" varchar NOT NULL,
    "hint" varchar,
    "hint_eng" varchar,
    "type" "enum_career_settings_form_questions_type" DEFAULT 'text' NOT NULL,
    "required" boolean DEFAULT false,
    "hidden" boolean DEFAULT false
  );

  ALTER TABLE "job_applications" ADD COLUMN "cv_id" integer;
  ALTER TABLE "job_applications" ADD COLUMN "form_version" varchar;
  ALTER TABLE "job_applications" ADD COLUMN "language" "enum_job_applications_language";
  ALTER TABLE "job_applications" ADD COLUMN "answer_summary" varchar;
  ALTER TABLE "job_applications" ADD COLUMN "answer_snapshot" jsonb;
  ALTER TABLE "contact" ADD COLUMN "exhibition_url" varchar DEFAULT 'https://docs.google.com/forms/d/e/1FAIpQLSdrA3VX3YpxQB3uZ1ojXov8-J3LPawAt4ip_Aj4k8FNbNOCrA/viewform?usp=dialog';
  ALTER TABLE "contact" ADD COLUMN "exhibition_label" varchar DEFAULT 'Rendezvényen való kiállítási igény';
  ALTER TABLE "contact" ADD COLUMN "exhibition_label_eng" varchar DEFAULT 'Event Exhibition Request';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "application_cvs_id" integer;
  ALTER TABLE "career_settings_form_questions_options" ADD CONSTRAINT "career_settings_form_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_settings_form_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_settings_form_questions" ADD CONSTRAINT "career_settings_form_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "application_cvs_updated_at_idx" ON "application_cvs" USING btree ("updated_at");
  CREATE INDEX "application_cvs_created_at_idx" ON "application_cvs" USING btree ("created_at");
  CREATE UNIQUE INDEX "application_cvs_filename_idx" ON "application_cvs" USING btree ("filename");
  CREATE INDEX "career_settings_form_questions_options_order_idx" ON "career_settings_form_questions_options" USING btree ("_order");
  CREATE INDEX "career_settings_form_questions_options_parent_id_idx" ON "career_settings_form_questions_options" USING btree ("_parent_id");
  CREATE INDEX "career_settings_form_questions_order_idx" ON "career_settings_form_questions" USING btree ("_order");
  CREATE INDEX "career_settings_form_questions_parent_id_idx" ON "career_settings_form_questions" USING btree ("_parent_id");
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_cv_id_application_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."application_cvs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_application_cvs_fk" FOREIGN KEY ("application_cvs_id") REFERENCES "public"."application_cvs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "job_applications_cv_idx" ON "job_applications" USING btree ("cv_id");
  CREATE INDEX "payload_locked_documents_rels_application_cvs_id_idx" ON "payload_locked_documents_rels" USING btree ("application_cvs_id");`)
  // Freeze the initial form in this migration; later code changes must not alter it.
  const questions = [
  {
    "key": "name",
    "label": "Név",
    "labelEng": "Name",
    "type": "text",
    "required": true
  },
  {
    "key": "email",
    "label": "E-mail cím",
    "labelEng": "Email address",
    "type": "text",
    "required": true
  },
  {
    "key": "phone",
    "label": "Telefonszám",
    "labelEng": "Phone number",
    "type": "text"
  },
  {
    "key": "semester",
    "label": "Hányadik félév",
    "labelEng": "Semester",
    "type": "text"
  },
  {
    "key": "university",
    "label": "Egyetem / kar",
    "labelEng": "University / faculty",
    "type": "text"
  },
  {
    "key": "major",
    "label": "Szak",
    "labelEng": "Major",
    "type": "text"
  },
  {
    "key": "groupName",
    "label": "Csoport",
    "labelEng": "Group",
    "type": "text"
  },
  {
    "key": "positionName",
    "label": "Pozíció",
    "labelEng": "Position",
    "type": "text"
  },
  {
    "key": "motivation",
    "label": "Motiváció / üzenet",
    "labelEng": "Motivation / message",
    "type": "textarea"
  },
  {
    "key": "consent",
    "label": "Hozzájárulok a személyes adataim kezeléséhez a jelentkezés elbírálása céljából.",
    "labelEng": "I consent to the processing of my personal data for the purpose of the application.",
    "type": "checkbox",
    "required": true
  }
];
  for (const [order, question] of questions.entries()) {
    await db.execute(sql`INSERT INTO career_settings_form_questions (_order, _parent_id, id, key, label, label_eng, type, required, hidden)
      SELECT ${order + 1}, id, 'initial-' || id || '-' || ${question.key}, ${question.key}, ${question.label}, ${question.labelEng}, ${question.type}::enum_career_settings_form_questions_type, ${question.required ?? false}, false FROM career_settings`);
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "application_cvs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_settings_form_questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_settings_form_questions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "application_cvs" CASCADE;
  DROP TABLE "career_settings_form_questions_options" CASCADE;
  DROP TABLE "career_settings_form_questions" CASCADE;
  ALTER TABLE "job_applications" DROP CONSTRAINT IF EXISTS "job_applications_cv_id_application_cvs_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_application_cvs_fk";

  DROP INDEX "job_applications_cv_idx";
  DROP INDEX "payload_locked_documents_rels_application_cvs_id_idx";
  ALTER TABLE "job_applications" DROP COLUMN "cv_id";
  ALTER TABLE "job_applications" DROP COLUMN "form_version";
  ALTER TABLE "job_applications" DROP COLUMN "language";
  ALTER TABLE "job_applications" DROP COLUMN "answer_summary";
  ALTER TABLE "job_applications" DROP COLUMN "answer_snapshot";
  ALTER TABLE "contact" DROP COLUMN "exhibition_url";
  ALTER TABLE "contact" DROP COLUMN "exhibition_label";
  ALTER TABLE "contact" DROP COLUMN "exhibition_label_eng";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "application_cvs_id";
  DROP TYPE "public"."enum_job_applications_language";
  DROP TYPE "public"."enum_career_settings_form_questions_type";`)
}
