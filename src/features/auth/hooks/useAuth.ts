import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { refreshStorage, tokenStorage } from '@/lib/token-storage';
import { getSession, login, logout } from '../api/auth.api';
import { type AuthUser, type UserRole } from '../types/auth.types';

/** Query-key factory for the session (the single source of auth truth). */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

/**
 * The current session. `data` is the {@link AuthUser} when logged in, or `null`
 * when a guest. Backed by React Query so every component reads one cache.
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: getSession,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/** Convenience accessor for the logged-in user (or `null`). */
export function useAuthUser(): AuthUser | null {
  return useSession().data ?? null;
}

/** True only when the session resolves to a user with the given role. */
export function useHasRole(role: UserRole): boolean {
  return useAuthUser()?.role === role;
}

/** Log in, then prime the session cache so the UI updates immediately. */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      tokenStorage.set(res.accessToken);
      refreshStorage.set(res.refreshToken);
      queryClient.setQueryData(authKeys.session(), res.user);
    },
  });
}

/** Log out, clear tokens, and drop every cached query (private data). */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      tokenStorage.clear();
      refreshStorage.clear();
      queryClient.setQueryData(authKeys.session(), null);
      // Remove other users' cached data (saved tutors, account, …).
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'auth' });
    },
  });
}
