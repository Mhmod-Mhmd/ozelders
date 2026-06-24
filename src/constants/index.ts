import { env } from '@/config/env';

/** Public application name. */
export const APP_NAME = env.appName;

/** Default page size for paginated lists. */
export const DEFAULT_PAGE_SIZE = 20;

/** Debounce delay (ms) for search inputs. */
export const SEARCH_DEBOUNCE_MS = 300;

/** localStorage / query-string keys used across the app. */
export const STORAGE_KEYS = {
  accessToken: 'ozelders.accessToken',
  theme: 'ozelders.theme',
} as const;
