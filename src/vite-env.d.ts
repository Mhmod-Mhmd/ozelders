/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API, e.g. https://api.ozelders.com */
  readonly VITE_API_BASE_URL: string;
  /** Public application name shown in the UI. */
  readonly VITE_APP_NAME: string;
  /** Current environment label: "development" | "staging" | "production". */
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
