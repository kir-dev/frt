import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** These fields existed in snapshots, but were absent from the executable chain. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE events ADD COLUMN IF NOT EXISTS link_to_picture_from_event_id integer;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS slug varchar;
    ALTER TABLE events ALTER COLUMN location DROP NOT NULL;

    -- Keep existing URLs; give legacy events a unique URL based on their ID.
    DO $$
    DECLARE legacy_event record; candidate varchar; suffix integer;
    BEGIN
      FOR legacy_event IN SELECT id FROM events WHERE slug IS NULL OR btrim(slug) = '' ORDER BY id LOOP
        candidate := 'esemeny-' || legacy_event.id;
        suffix := 0;
        WHILE EXISTS (SELECT 1 FROM events WHERE slug = candidate) LOOP
          suffix := suffix + 1;
          candidate := 'esemeny-' || legacy_event.id || '-' || suffix;
        END LOOP;
        UPDATE events SET slug = candidate WHERE id = legacy_event.id;
      END LOOP;
    END $$;

    ALTER TABLE events ALTER COLUMN slug SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events (slug);
    CREATE INDEX IF NOT EXISTS events_link_to_picture_from_event_idx ON events (link_to_picture_from_event_id);
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'events_link_to_picture_from_event_id_gallery_id_fk'
          AND conrelid = 'events'::regclass
      ) THEN
        ALTER TABLE events ADD CONSTRAINT events_link_to_picture_from_event_id_gallery_id_fk
          FOREIGN KEY (link_to_picture_from_event_id) REFERENCES gallery(id) ON DELETE SET NULL;
      END IF;
    END $$;
  `)
}

// An existing installation may already contain these fields and user data.
export async function down(): Promise<void> {}
