/**
 * The signed-in student's account profile. In a real backend this would be the
 * row behind `GET /account` for the authenticated user; here it's a mutable
 * in-memory record the mock API reads and updates so edits persist for the
 * lifetime of the page session.
 *
 * Only the mock backend (`src/lib/mock`) should touch these helpers.
 */

export type SocialProvider = 'facebook' | 'google';

export interface SocialConnection {
  connected: boolean;
  /** Display name reported by the provider when connected. */
  displayName?: string;
}

/** How lessons taking place outside the platform are auto-confirmed. */
export type AutoconfirmMode = 'scheduled' | 'all';

/** Optional email categories the student can opt in/out of. */
export interface NotificationPrefs {
  tips: boolean;
  surveys: boolean;
}

export interface AccountRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  /** ISO 3166-1 alpha-2 code selecting the phone dial code (e.g. `US`). */
  phoneCountry: string;
  /** Local part of the phone number, digits only. */
  phoneNumber: string;
  /** IANA timezone identifier (e.g. `Europe/Istanbul`). */
  timezone: string;
  socials: Record<SocialProvider, SocialConnection>;
  /** Whether the device currently allows push notifications. */
  pushEnabled: boolean;
  notificationPrefs: NotificationPrefs;
  autoconfirm: AutoconfirmMode;
  calendarConnected: boolean;
}

let account: AccountRecord = {
  id: 'me',
  firstName: 'Mhmoud',
  lastName: 'M.',
  email: 'ofisxt@gmail.com',
  avatarUrl: 'https://i.pravatar.cc/160?img=47',
  phoneCountry: 'US',
  phoneNumber: '',
  timezone: 'Europe/Istanbul',
  socials: {
    facebook: { connected: false },
    google: { connected: true, displayName: 'Mhmoud M.' },
  },
  pushEnabled: false,
  notificationPrefs: { tips: true, surveys: true },
  autoconfirm: 'all',
  calendarConnected: false,
};

/** The student's password. Real backends store a hash; here it's plain text
 *  purely so the change-password flow can validate the current value. */
let password = 'password123';

/** The current account record (returned by `GET /account`). */
export function getAccount(): AccountRecord {
  return account;
}

/** Patch the editable profile fields and return the updated record. */
export function updateAccount(
  patch: Partial<
    Pick<
      AccountRecord,
      'firstName' | 'lastName' | 'phoneCountry' | 'phoneNumber' | 'timezone'
    >
  >,
): AccountRecord {
  account = { ...account, ...patch };
  return account;
}

/** Replace the avatar image and return the updated record. */
export function setAccountAvatar(avatarUrl: string): AccountRecord {
  account = { ...account, avatarUrl };
  return account;
}

/** Connect a social provider and return the updated record. */
export function connectSocial(
  provider: SocialProvider,
  displayName: string,
): AccountRecord {
  account = {
    ...account,
    socials: {
      ...account.socials,
      [provider]: { connected: true, displayName },
    },
  };
  return account;
}

/** Disconnect a social provider and return the updated record. */
export function disconnectSocial(provider: SocialProvider): AccountRecord {
  account = {
    ...account,
    socials: { ...account.socials, [provider]: { connected: false } },
  };
  return account;
}

/** Update the account email and return the updated record. */
export function updateEmail(email: string): AccountRecord {
  account = { ...account, email };
  return account;
}

/** Whether the supplied value matches the current password. */
export function verifyPassword(value: string): boolean {
  return value === password;
}

/** Replace the stored password. */
export function setPassword(value: string): void {
  password = value;
}

/** Update the optional email-notification preferences. */
export function updateNotificationPrefs(
  prefs: NotificationPrefs,
): AccountRecord {
  account = { ...account, notificationPrefs: prefs };
  return account;
}

/** Update the lesson auto-confirmation mode. */
export function updateAutoconfirm(mode: AutoconfirmMode): AccountRecord {
  account = { ...account, autoconfirm: mode };
  return account;
}

/** Connect or disconnect the linked calendar. */
export function setCalendarConnected(connected: boolean): AccountRecord {
  account = { ...account, calendarConnected: connected };
  return account;
}
