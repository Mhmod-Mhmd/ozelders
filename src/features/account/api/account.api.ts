import { httpClient } from '@/lib/axios';
import {
  type Account,
  type AutoconfirmMode,
  type NotificationPrefs,
  type NotificationSettings,
  type SocialProvider,
  type UpdateAccountInput,
} from '../types/account.types';

const RESOURCE = '/account';

/** Fetch the signed-in student's account profile. */
export async function getAccount(): Promise<Account> {
  const { data } = await httpClient.get<Account>(RESOURCE);
  return data;
}

/** Update the editable profile fields; returns the updated account. */
export async function updateAccount(
  input: UpdateAccountInput,
): Promise<Account> {
  const { data } = await httpClient.patch<Account>(RESOURCE, input);
  return data;
}

/** Upload a new avatar (sent as a data URL); returns the updated account. */
export async function uploadAvatar(dataUrl: string): Promise<Account> {
  const { data } = await httpClient.post<Account>(`${RESOURCE}/avatar`, {
    dataUrl,
  });
  return data;
}

/** Connect a social provider; returns the updated account. */
export async function connectSocial(
  provider: SocialProvider,
): Promise<Account> {
  const { data } = await httpClient.post<Account>(
    `${RESOURCE}/social/${provider}`,
  );
  return data;
}

/** Disconnect a social provider; returns the updated account. */
export async function disconnectSocial(
  provider: SocialProvider,
): Promise<Account> {
  const { data } = await httpClient.delete<Account>(
    `${RESOURCE}/social/${provider}`,
  );
  return data;
}

/** Update the account email; returns the updated account. */
export async function updateEmail(email: string): Promise<Account> {
  const { data } = await httpClient.patch<Account>(`${RESOURCE}/email`, {
    email,
  });
  return data;
}

/** Change the account password. */
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean }> {
  const { data } = await httpClient.patch<{ success: boolean }>(
    `${RESOURCE}/password`,
    input,
  );
  return data;
}

/** Fetch the notification settings (device push + email preferences). */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  const { data } = await httpClient.get<NotificationSettings>(
    `${RESOURCE}/notifications`,
  );
  return data;
}

/** Update the email-notification preferences. */
export async function updateNotificationPrefs(
  prefs: NotificationPrefs,
): Promise<NotificationSettings> {
  const { data } = await httpClient.patch<NotificationSettings>(
    `${RESOURCE}/notifications`,
    { prefs },
  );
  return data;
}

/** Fetch the lesson auto-confirmation mode. */
export async function getAutoconfirm(): Promise<{ mode: AutoconfirmMode }> {
  const { data } = await httpClient.get<{ mode: AutoconfirmMode }>(
    `${RESOURCE}/autoconfirmation`,
  );
  return data;
}

/** Update the lesson auto-confirmation mode. */
export async function updateAutoconfirm(
  mode: AutoconfirmMode,
): Promise<{ mode: AutoconfirmMode }> {
  const { data } = await httpClient.patch<{ mode: AutoconfirmMode }>(
    `${RESOURCE}/autoconfirmation`,
    { mode },
  );
  return data;
}

/** Fetch whether the calendar is connected. */
export async function getCalendar(): Promise<{ connected: boolean }> {
  const { data } = await httpClient.get<{ connected: boolean }>(
    `${RESOURCE}/calendar`,
  );
  return data;
}

/** Connect or disconnect the linked calendar. */
export async function setCalendar(
  connected: boolean,
): Promise<{ connected: boolean }> {
  const { data } = connected
    ? await httpClient.post<{ connected: boolean }>(`${RESOURCE}/calendar`)
    : await httpClient.delete<{ connected: boolean }>(`${RESOURCE}/calendar`);
  return data;
}

/** Permanently delete the account after email confirmation. */
export async function deleteAccount(
  email: string,
): Promise<{ success: boolean }> {
  const { data } = await httpClient.delete<{ success: boolean }>(RESOURCE, {
    data: { email },
  });
  return data;
}
