/**
 * Auth token storage.
 *
 * Per the app's auth model:
 *  - The **access token** (a short-lived JWT) is kept **in memory only** and is
 *    never persisted — it's lost on reload and restored via the refresh flow.
 *  - The **refresh token** is, in production, an HttpOnly cookie set by the
 *    backend and unreadable by JS. A frontend-only mock can't set HttpOnly
 *    cookies, so we persist an **opaque (non-JWT) handle** in localStorage to
 *    simulate that cross-reload persistence. No JWT ever touches localStorage.
 */

/* ------------------------------------------------------------------ */
/* Access token — in-memory.                                          */
/* ------------------------------------------------------------------ */

let accessToken: string | null = null;

export const tokenStorage = {
  get(): string | null {
    return accessToken;
  },
  set(token: string): void {
    accessToken = token;
  },
  clear(): void {
    accessToken = null;
  },
};

/* ------------------------------------------------------------------ */
/* Refresh handle — simulates the backend's HttpOnly cookie.          */
/* ------------------------------------------------------------------ */

const REFRESH_KEY = 'ozelders.refresh';

export const refreshStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(REFRESH_KEY, token);
    } catch {
      /* storage unavailable — ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* storage unavailable — ignore */
    }
  },
};
