/**
 * Thin wrapper around persistent auth-token storage.
 *
 * Centralizing this here means the storage mechanism (localStorage today,
 * cookies or an in-memory store tomorrow) can change without touching the
 * Axios client or feature code. All access is wrapped in try/catch because
 * storage can throw (private mode, disabled cookies, SSR).
 */

const ACCESS_TOKEN_KEY = 'ozelders.accessToken';

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  set(token: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      /* storage unavailable — ignore */
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch {
      /* storage unavailable — ignore */
    }
  },
};
