import { z } from 'zod';

/** Roles the app understands. Route access is gated on these. */
export type UserRole = 'student' | 'tutor' | 'admin';

/** The authenticated user, as returned by the auth endpoints. */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

/** Successful `POST /auth/login` payload. */
export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Login form contract. Error messages are i18n keys resolved at render time so
 * validation copy stays translatable. Shared with the request payload via
 * `z.infer` so the form and the API can't drift.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.emailRequired')
    .email('auth.errors.emailInvalid'),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
});

export type LoginInput = z.infer<typeof loginSchema>;
