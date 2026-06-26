/**
 * Mock user directory backing the authentication endpoints. In a real backend
 * this would be the `users` table; here it's an in-memory list the mock API
 * reads to validate credentials and resolve sessions.
 *
 * Only the mock backend (`src/lib/mock`) should touch these helpers. Passwords
 * live here purely so the mock login can validate them — never do this in a real
 * system.
 */

export type UserRole = 'student' | 'tutor' | 'admin';

/** Public-facing user shape returned by the auth endpoints (no secrets). */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

interface AuthUserRecord extends AuthUser {
  /** Plain-text only because this is a mock; real backends store a hash. */
  password: string;
}

/**
 * Demo accounts. The student id (`me`) matches the settings account record so
 * the two stay in sync. Credentials are surfaced on the login screen so the
 * app is easy to try.
 */
const USERS: AuthUserRecord[] = [
  {
    id: 'me',
    firstName: 'Mhmoud',
    lastName: 'M.',
    email: 'student@ozelders.com',
    avatarUrl: 'https://i.pravatar.cc/160?img=47',
    role: 'student',
    password: 'password123',
  },
  {
    id: 'tutor-1',
    firstName: 'Aylin',
    lastName: 'K.',
    email: 'tutor@ozelders.com',
    avatarUrl: 'https://i.pravatar.cc/160?img=32',
    role: 'tutor',
    password: 'password123',
  },
];

/** Strip the password before a record ever leaves the data layer. */
function toPublicUser({ password: _password, ...user }: AuthUserRecord): AuthUser {
  return user;
}

/** Validate an email/password pair; returns the public user or `null`. */
export function authenticate(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const record = USERS.find((u) => u.email.toLowerCase() === normalized);
  if (!record || record.password !== password) return null;
  return toPublicUser(record);
}

/** Resolve a user from a (mock) token's subject id. */
export function findUserById(id: string): AuthUser | null {
  const record = USERS.find((u) => u.id === id);
  return record ? toPublicUser(record) : null;
}
