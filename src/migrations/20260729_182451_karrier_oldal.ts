import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_applications_sheet_sync_status" AS ENUM('ok', 'skipped', 'error');
  CREATE TYPE "public"."enum_career_settings_application_mode" AS ENUM('builtIn', 'googleForm');
  CREATE TABLE "recruitment_positions_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_title" varchar NOT NULL,
  	"section_title_eng" varchar NOT NULL,
  	"section_content" jsonb NOT NULL,
  	"section_content_eng" jsonb NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"university" varchar,
  	"major" varchar,
  	"semester" varchar,
  	"group_name" varchar,
  	"position_name" varchar,
  	"motivation" varchar,
  	"consent" boolean,
  	"sheet_sync_status" "enum_job_applications_sheet_sync_status",
  	"sheet_sync_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "career_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro" jsonb,
  	"intro_eng" jsonb,
  	"application_mode" "enum_career_settings_application_mode" DEFAULT 'builtIn',
  	"google_form_url" varchar,
  	"applications_open" boolean DEFAULT true,
  	"applications_closed_text" varchar,
  	"applications_closed_text_eng" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_description" DROP NOT NULL;
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_description_eng" DROP NOT NULL;
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_open" DROP DEFAULT;
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_open" DROP NOT NULL;
  ALTER TABLE "recruitment_positions" ADD COLUMN "highlights_joining" varchar;
  ALTER TABLE "recruitment_positions" ADD COLUMN "highlights_joining_eng" varchar;
  ALTER TABLE "recruitment_positions" ADD COLUMN "highlights_time_commitment" varchar;
  ALTER TABLE "recruitment_positions" ADD COLUMN "highlights_time_commitment_eng" varchar;
  ALTER TABLE "recruitment_positions" ADD COLUMN "highlights_subsystem" varchar;
  ALTER TABLE "recruitment_positions" ADD COLUMN "highlights_subsystem_eng" varchar;
  ALTER TABLE "recruitment" ADD COLUMN "image_id" integer;
  ALTER TABLE "recruitment" ADD COLUMN "order" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_applications_id" integer;
  ALTER TABLE "recruitment_positions_sections" ADD CONSTRAINT "recruitment_positions_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recruitment_positions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "recruitment_positions_sections_order_idx" ON "recruitment_positions_sections" USING btree ("_order");
  CREATE INDEX "recruitment_positions_sections_parent_id_idx" ON "recruitment_positions_sections" USING btree ("_parent_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  ALTER TABLE "recruitment" ADD CONSTRAINT "recruitment_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "recruitment_image_idx" ON "recruitment" USING btree ("image_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "recruitment_positions_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "recruitment_positions_sections" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "career_settings" CASCADE;
  ALTER TABLE "recruitment" DROP CONSTRAINT "recruitment_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_applications_fk";
  
  DROP INDEX "recruitment_image_idx";
  DROP INDEX "payload_locked_documents_rels_job_applications_id_idx";
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_open" SET DEFAULT false;
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_open" SET NOT NULL;
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_description" SET NOT NULL;
  ALTER TABLE "recruitment_positions" ALTER COLUMN "position_description_eng" SET NOT NULL;
  ALTER TABLE "recruitment_positions" DROP COLUMN "highlights_joining";
  ALTER TABLE "recruitment_positions" DROP COLUMN "highlights_joining_eng";
  ALTER TABLE "recruitment_positions" DROP COLUMN "highlights_time_commitment";
  ALTER TABLE "recruitment_positions" DROP COLUMN "highlights_time_commitment_eng";
  ALTER TABLE "recruitment_positions" DROP COLUMN "highlights_subsystem";
  ALTER TABLE "recruitment_positions" DROP COLUMN "highlights_subsystem_eng";
  ALTER TABLE "recruitment" DROP COLUMN "image_id";
  ALTER TABLE "recruitment" DROP COLUMN "order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_applications_id";
  DROP TYPE "public"."enum_job_applications_sheet_sync_status";
  DROP TYPE "public"."enum_career_settings_application_mode";`)
}
