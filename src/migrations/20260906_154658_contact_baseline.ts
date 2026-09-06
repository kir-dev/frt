import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Older snapshots included Contact, but the executable migration chain did not. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS contact (
      id serial PRIMARY KEY NOT NULL,
      title varchar NOT NULL, title_en varchar NOT NULL,
      content jsonb NOT NULL, content_en jsonb NOT NULL,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS contact_updated_at_idx ON contact (updated_at);
    CREATE INDEX IF NOT EXISTS contact_created_at_idx ON contact (created_at);
    ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS contact_id integer;
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_contact_id_idx ON payload_locked_documents_rels (contact_id);
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_contact_fk') THEN
        ALTER TABLE payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_contact_fk FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}
// Contact may predate this repair on an existing installation: preserve its data on rollback.
export async function down(): Promise<void> {}
