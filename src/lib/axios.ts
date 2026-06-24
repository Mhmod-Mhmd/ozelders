import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { ApiError, type ApiErrorResponse } from '@/types/api';
import { tokenStorage } from './token-storage';

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
/* Response: normalize every failure into an `ApiError`.               */
/* ------------------------------------------------------------------ */
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const apiError = normalizeError(error);

    // Centralized handling of expired/invalid sessions.
    if (apiError.status === 401) {
      tokenStorage.clear();
      // TODO: redirect to the login route once the auth flow is implemented.
    }

    return Promise.reject(apiError);
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
