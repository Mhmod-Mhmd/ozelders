/** Settings sections, in display order. `account` is the only live section. */
export const SETTINGS_SECTIONS = [
  'account',
  'password',
  'email',
  'paymentMethods',
  'paymentHistory',
  'autoconfirmation',
  'calendar',
  'notifications',
  'deleteAccount',
] as const;

export type SettingsSection = (typeof SETTINGS_SECTIONS)[number];
