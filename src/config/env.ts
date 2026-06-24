/**
 * Typed, validated access to environment variables.
 *
 * Import `env` instead of reading `import.meta.env` directly so that:
 *  - values are validated once at startup (fail fast on misconfiguration),
 *  - the rest of the app depends on a small, typed surface.
 */

type AppEnv = 'development' | 'staging' | 'production';

interface Env {
  apiBaseUrl: string;
  appName: string;
  appEnv: AppEnv;
  /** True when running the Vite dev server. */
  isDev: boolean;
  /** True for production builds. */
  isProd: boolean;
}

function requireVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (value === undefined || value === '') {
    throw new Error(
      `[env] Missing required environment variable "${key}". ` +
        `Add it to your .env file (see .env.example).`,
    );
  }
  return value;
}

export const env: Env = {
  apiBaseUrl: requireVar('VITE_API_BASE_URL'),
  appName: import.meta.env.VITE_APP_NAME ?? 'Ozelders',
  appEnv: (import.meta.env.VITE_APP_ENV ?? 'development') as AppEnv,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
