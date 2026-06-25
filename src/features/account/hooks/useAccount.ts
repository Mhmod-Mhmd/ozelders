import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  connectSocial,
  deleteAccount,
  disconnectSocial,
  getAccount,
  getAutoconfirm,
  getCalendar,
  getNotificationSettings,
  setCalendar,
  updateAccount,
  updateAutoconfirm,
  updateEmail,
  updateNotificationPrefs,
  uploadAvatar,
} from '../api/account.api';
import {
  type Account,
  type AutoconfirmMode,
  type NotificationPrefs,
  type SocialProvider,
  type UpdateAccountInput,
} from '../types/account.types';

/** Query-key factory for the account feature. */
export const accountKeys = {
  all: ['account'] as const,
  current: () => [...accountKeys.all, 'current'] as const,
  notifications: () => [...accountKeys.all, 'notifications'] as const,
  autoconfirm: () => [...accountKeys.all, 'autoconfirm'] as const,
  calendar: () => [...accountKeys.all, 'calendar'] as const,
};

/** The signed-in student's account profile. */
export function useAccount() {
  return useQuery({
    queryKey: accountKeys.current(),
    queryFn: getAccount,
    staleTime: 60 * 1000,
  });
}

/** Update the editable profile fields. */
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAccountInput) => updateAccount(input),
    onSuccess: (account) => {
      queryClient.setQueryData(accountKeys.current(), account);
    },
  });
}

/** Upload a new avatar image (data URL). */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dataUrl: string) => uploadAvatar(dataUrl),
    onSuccess: (account) => {
      queryClient.setQueryData(accountKeys.current(), account);
    },
  });
}

/** Connect or disconnect a social provider. */
export function useToggleSocial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      provider,
      connected,
    }: {
      provider: SocialProvider;
      connected: boolean;
    }) => (connected ? disconnectSocial(provider) : connectSocial(provider)),
    onSuccess: (account: Account) => {
      queryClient.setQueryData(accountKeys.current(), account);
    },
  });
}

/** Update the account email. */
export function useUpdateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => updateEmail(email),
    onSuccess: (account) => {
      queryClient.setQueryData(accountKeys.current(), account);
    },
  });
}

/** Change the account password. */
export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      changePassword(input),
  });
}

/** Notification settings (device push + email preferences). */
export function useNotificationSettings() {
  return useQuery({
    queryKey: accountKeys.notifications(),
    queryFn: getNotificationSettings,
  });
}

/** Update email-notification preferences. */
export function useUpdateNotificationPrefs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: NotificationPrefs) => updateNotificationPrefs(prefs),
    onSuccess: (settings) => {
      queryClient.setQueryData(accountKeys.notifications(), settings);
    },
  });
}

/** Lesson auto-confirmation mode. */
export function useAutoconfirm() {
  return useQuery({
    queryKey: accountKeys.autoconfirm(),
    queryFn: getAutoconfirm,
  });
}

/** Update the lesson auto-confirmation mode. */
export function useUpdateAutoconfirm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mode: AutoconfirmMode) => updateAutoconfirm(mode),
    onSuccess: (data) => {
      queryClient.setQueryData(accountKeys.autoconfirm(), data);
    },
  });
}

/** Calendar connection state. */
export function useCalendar() {
  return useQuery({
    queryKey: accountKeys.calendar(),
    queryFn: getCalendar,
  });
}

/** Connect or disconnect the calendar. */
export function useSetCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connected: boolean) => setCalendar(connected),
    onSuccess: (data) => {
      queryClient.setQueryData(accountKeys.calendar(), data);
    },
  });
}

/** Permanently delete the account. */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (email: string) => deleteAccount(email),
  });
}
