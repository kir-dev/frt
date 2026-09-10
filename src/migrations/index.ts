import * as migration_contact_baseline from "./20260906_154658_contact_baseline";
import * as migration_events_baseline from "./20260906_220000_events_baseline";
import * as migration_20250907_085438 from './20250907_085438';
import * as migration_20251108_000000_add_support_us_button_text from './20251108_000000_add_support_us_button_text';
import * as migration_20251108_172023_add_events_facebook_event_link from './20251108_172023_add_events_facebook_event_link';
import * as migration_20251118_160316_add_formula_student from './20251118_160316_add_formula_student';
import * as migration_20251124_120000_fix_locked_documents_relation from './20251124_120000_fix_locked_documents_relation';
import * as migration_20251130_000000_init_site_settings from './20251130_000000_init_site_settings';
import * as migration_20251201_090036_publications_optional_link from './20251201_090036_publications_optional_link';
import * as migration_20251206_100136_update_payload_3_67 from './20251206_100136_update_payload_3_67';
import * as migration_20260729_182451_karrier_oldal from './20260729_182451_karrier_oldal';
import * as migration_20260730_204153_karrier_sheets_link from './20260730_204153_karrier_sheets_link';
import * as migration_20260803_170842_karrier_faq from './20260803_170842_karrier_faq';
import * as migration_20260906_154659_career_form_cv_contact from './20260906_154659_career_form_cv_contact';
import * as migration_20260910_194346_add_cv_required_setting from './20260910_194346_add_cv_required_setting';

export const migrations = [
  {
    up: migration_20250907_085438.up,
    down: migration_20250907_085438.down,
    name: '20250907_085438',
  },
  {
    up: migration_20251108_000000_add_support_us_button_text.up,
    down: migration_20251108_000000_add_support_us_button_text.down,
    name: '20251108_000000_add_support_us_button_text',
  },
  {
    up: migration_20251108_172023_add_events_facebook_event_link.up,
    down: migration_20251108_172023_add_events_facebook_event_link.down,
    name: '20251108_172023_add_events_facebook_event_link',
  },
  {
    up: migration_20251118_160316_add_formula_student.up,
    down: migration_20251118_160316_add_formula_student.down,
    name: '20251118_160316_add_formula_student',
  },
  {
    up: migration_20251124_120000_fix_locked_documents_relation.up,
    down: migration_20251124_120000_fix_locked_documents_relation.down,
    name: '20251124_120000_fix_locked_documents_relation',
  },
  {
    up: migration_20251130_000000_init_site_settings.up,
    down: migration_20251130_000000_init_site_settings.down,
    name: '20251130_000000_init_site_settings',
  },
  {
    up: migration_20251201_090036_publications_optional_link.up,
    down: migration_20251201_090036_publications_optional_link.down,
    name: '20251201_090036_publications_optional_link',
  },
  {
    up: migration_20251206_100136_update_payload_3_67.up,
    down: migration_20251206_100136_update_payload_3_67.down,
    name: '20251206_100136_update_payload_3_67',
  },
  {
    up: migration_20260729_182451_karrier_oldal.up,
    down: migration_20260729_182451_karrier_oldal.down,
    name: '20260729_182451_karrier_oldal',
  },
  {
    up: migration_20260730_204153_karrier_sheets_link.up,
    down: migration_20260730_204153_karrier_sheets_link.down,
    name: '20260730_204153_karrier_sheets_link',
  },
  {
    up: migration_20260803_170842_karrier_faq.up,
    down: migration_20260803_170842_karrier_faq.down,
    name: '20260803_170842_karrier_faq',
  },
  { up: migration_contact_baseline.up, down: migration_contact_baseline.down, name: "20260906_154658_contact_baseline" },
  {
    up: migration_20260906_154659_career_form_cv_contact.up,
    down: migration_20260906_154659_career_form_cv_contact.down,
    name: '20260906_154659_career_form_cv_contact'
  },
  {
    up: migration_events_baseline.up,
    down: migration_events_baseline.down,
    name: '20260906_220000_events_baseline',
  },
  {
    up: migration_20260910_194346_add_cv_required_setting.up,
    down: migration_20260910_194346_add_cv_required_setting.down,
    name: '20260910_194346_add_cv_required_setting'
  },
];
