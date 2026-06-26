import { httpClient } from '@/lib/axios';
import { ApiError } from '@/types';
import {
  type AuthUser,
  type LoginInput,
  type LoginResponse,
} from '../types/auth.types';

/** Exchange credentials for a session (tokens + user). */
export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', input);
  return data;
}

/**
 * Resolve the current session. Returns `null` when unauthenticated — a 401 here
 * is an expected "logged out" state, not an error, so the UI can render the
 * guest experience instead of an error screen. (The axios interceptor will have
 * already tried to refresh before this 401 surfaced.)
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const { data } = await httpClient.get<{ user: AuthUser }>('/auth/session');
    return data.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/** End the session on the server (client clears its tokens separately). */
export async function logout(): Promise<void> {
  await httpClient.post('/auth/logout');
}
