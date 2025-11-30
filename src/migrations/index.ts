import * as migration_20250907_085438 from './20250907_085438';
import * as migration_20251108_000000_add_support_us_button_text from './20251108_000000_add_support_us_button_text';
import * as migration_20251108_172023_add_events_facebook_event_link from './20251108_172023_add_events_facebook_event_link';
import * as migration_20251118_160316_add_formula_student from './20251118_160316_add_formula_student';
import * as migration_20251124_120000_fix_locked_documents_relation from './20251124_120000_fix_locked_documents_relation';
import * as migration_20251130_000000_init_site_settings from './20251130_000000_init_site_settings';

export const migrations = [
  {
    up: migration_20250907_085438.up,
    down: migration_20250907_085438.down,
    name: '20250907_085438'
  },
  {
    up: migration_20251108_000000_add_support_us_button_text.up,
    down: migration_20251108_000000_add_support_us_button_text.down,
    name: '20251108_000000_add_support_us_button_text'
  },
  {
    up: migration_20251108_172023_add_events_facebook_event_link.up,
    down: migration_20251108_172023_add_events_facebook_event_link.down,
    name: '20251108_172023_add_events_facebook_event_link'
  },
  {
    up: migration_20251118_160316_add_formula_student.up,
    down: migration_20251118_160316_add_formula_student.down,
    name: '20251118_160316_add_formula_student'
  },
  {
    up: migration_20251124_120000_fix_locked_documents_relation.up,
    down: migration_20251124_120000_fix_locked_documents_relation.down,
    name: '20251124_120000_fix_locked_documents_relation'
  },
  {
    up: migration_20251130_000000_init_site_settings.up,
    down: migration_20251130_000000_init_site_settings.down,
    name: '20251130_000000_init_site_settings'
  },
];

