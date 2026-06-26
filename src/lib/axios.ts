import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { ApiError, type ApiErrorResponse } from '@/types/api';
import { refreshStorage, tokenStorage } from './token-storage';

/**
 * The single, shared Axios instance for the whole app.
 *
 * Feature code should import this client (or, better, the typed helpers in each
 * feature's `api/` folder) rather than calling `axios` directly, so that auth,
 * base URL, timeouts and error normalization are applied consistently.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ------------------------------------------------------------------ */
/* Request: attach the bearer token when present.                      */
/* ------------------------------------------------------------------ */
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------------------------------ */
/* Refresh flow: a 401 transparently refreshes the access token once.  */
/* ------------------------------------------------------------------ */

/** Requests that must never trigger the refresh-and-retry loop. */
function isAuthEndpoint(url = ''): boolean {
  return url.includes('/auth/login') || url.includes('/auth/refresh');
}

/**
 * Exchange the persisted refresh handle for a fresh access token. Concurrent
 * 401s share a single in-flight refresh so we only hit the endpoint once.
 */
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function doRefresh(): Promise<string | null> {
  const refreshToken = refreshStorage.get();
  if (!refreshToken) return null;
  try {
    const { data } = await httpClient.post<{ accessToken: string }>(
      '/auth/refresh',
      { refreshToken },
    );
    tokenStorage.set(data.accessToken);
    return data.accessToken;
  } catch {
    tokenStorage.clear();
    refreshStorage.clear();
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Response: refresh on 401, otherwise normalize into an `ApiError`.   */
/* ------------------------------------------------------------------ */
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const config = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // On an expired/missing access token, try to refresh once and replay the
    // original request. Auth endpoints are excluded to avoid an infinite loop.
    if (
      status === 401 &&
      config &&
      !config._retry &&
      !isAuthEndpoint(config.url)
    ) {
      config._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        config.headers = AxiosHeaders.from(config.headers);
        config.headers.set('Authorization', `Bearer ${newToken}`);
        return httpClient(config);
      }
      // Refresh failed → the session is gone. The `useSession` query treats the
      // resulting 401 as "logged out"; route guards then redirect to /login.
      tokenStorage.clear();
      refreshStorage.clear();
    }

    return Promise.reject(normalizeError(error));
  },
);

function normalizeError(error: AxiosError<ApiErrorResponse>): ApiError {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError({
      message: data?.message ?? error.message ?? 'Unexpected server error.',
      status,
      code: data?.code,
      fieldErrors: data?.errors,
    });
  }

  // No response was received → network error, timeout, or cancellation.
  return new ApiError({
    message: error.message || 'Network error. Please check your connection.',
    status: 0,
    code: error.code,
  });
}
