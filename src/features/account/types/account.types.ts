import { z } from 'zod';

/** Social providers a student can link to their account. */
export type SocialProvider = 'facebook' | 'google';

export interface SocialConnection {
  connected: boolean;
  displayName?: string;
}

/** How lessons taking place outside the platform are auto-confirmed. */
export type AutoconfirmMode = 'scheduled' | 'all';

/** Optional email categories the student can opt in/out of. */
export interface NotificationPrefs {
  tips: boolean;
  surveys: boolean;
}

/** Account profile as returned by `GET /account`. */
export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  /** ISO 3166-1 alpha-2 code selecting the phone dial code. */
  phoneCountry: string;
  phoneNumber: string;
  /** IANA timezone identifier. */
  timezone: string;
  socials: Record<SocialProvider, SocialConnection>;
  pushEnabled: boolean;
  notificationPrefs: NotificationPrefs;
  autoconfirm: AutoconfirmMode;
  calendarConnected: boolean;
}

/** Response of `GET /account/notifications`. */
export interface NotificationSettings {
  pushEnabled: boolean;
  prefs: NotificationPrefs;
}

/**
 * Validation schema for the account profile form. Shared with the API contract:
 * the request payload type is derived from it (`z.infer`) so the form and the
 * `PATCH /account` body can never drift.
 */
export const accountProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'settings.account.errors.firstNameRequired'),
  lastName: z.string().trim().max(60),
  phoneCountry: z.string().min(2),
  phoneNumber: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9\s-]*$/, 'settings.account.errors.phoneInvalid'),
  timezone: z.string().min(1),
});

/** Request payload for `PATCH /account`, derived from the schema. */
export type UpdateAccountInput = z.infer<typeof accountProfileSchema>;

/** Change-password form, validated client-side before `PATCH /account/password`. */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'settings.password.errors.currentRequired'),
    newPassword: z.string().min(8, 'settings.password.errors.newTooShort'),
    confirmPassword: z
      .string()
      .min(1, 'settings.password.errors.confirmRequired'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'settings.password.errors.mismatch',
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/** Email form schema, shared with `PATCH /account/email`. */
export const updateEmailSchema = z.object({
  email: z.string().trim().email('settings.email.errors.invalid'),
});

export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
