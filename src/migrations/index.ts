import * as migration_20250907_085438 from './20250907_085438';
import * as migration_20251108_000000_add_support_us_button_text from './20251108_000000_add_support_us_button_text';
import * as migration_20251108_172800_fix_support_us_button_text_column_names from './20251108_172800_fix_support_us_button_text_column_names';

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
    up: migration_20251108_172800_fix_support_us_button_text_column_names.up,
    down: migration_20251108_172800_fix_support_us_button_text_column_names.down,
    name: '20251108_172800_fix_support_us_button_text_column_names'
  },
];
