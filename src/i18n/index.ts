import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/common.json';
import tr from './locales/tr/common.json';
import ar from './locales/ar/common.json';

/**
 * Internationalization setup. English is the source of truth and fallback.
 * Adding a language later = drop a `locales/<lang>/` folder and add it to the
 * two lists below — no feature code changes.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  ar: { translation: ar },
};

export function dirFor(lng: string): 'ltr' | 'rtl' {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lng)?.dir ?? 'ltr';
}

/** Keep <html lang> and <html dir> in sync with the active language. */
function applyDocumentLanguage(lng: string): void {
  const root = document.documentElement;
  root.lang = lng;
  root.dir = dirFor(lng);
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ozelders.lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

applyDocumentLanguage(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;
