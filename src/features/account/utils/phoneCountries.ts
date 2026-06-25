/**
 * Curated dial-code list for the phone-number field. Country names are resolved
 * per-locale at render time via `Intl.DisplayNames`, so this stays language
 * agnostic — adding a locale never touches this file.
 */
export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code. */
  iso: string;
  /** International dial code, with leading `+`. */
  dial: string;
  /** Emoji flag. */
  flag: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: 'US', dial: '+1', flag: '🇺🇸' },
  { iso: 'GB', dial: '+44', flag: '🇬🇧' },
  { iso: 'TR', dial: '+90', flag: '🇹🇷' },
  { iso: 'DE', dial: '+49', flag: '🇩🇪' },
  { iso: 'FR', dial: '+33', flag: '🇫🇷' },
  { iso: 'ES', dial: '+34', flag: '🇪🇸' },
  { iso: 'IT', dial: '+39', flag: '🇮🇹' },
  { iso: 'AE', dial: '+971', flag: '🇦🇪' },
  { iso: 'SA', dial: '+966', flag: '🇸🇦' },
  { iso: 'EG', dial: '+20', flag: '🇪🇬' },
  { iso: 'IN', dial: '+91', flag: '🇮🇳' },
  { iso: 'PK', dial: '+92', flag: '🇵🇰' },
  { iso: 'RU', dial: '+7', flag: '🇷🇺' },
  { iso: 'BR', dial: '+55', flag: '🇧🇷' },
  { iso: 'JP', dial: '+81', flag: '🇯🇵' },
  { iso: 'CN', dial: '+86', flag: '🇨🇳' },
];

export function findPhoneCountry(iso: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.iso === iso) ?? PHONE_COUNTRIES[0];
}

/** Localized country name for an ISO code, falling back to the code itself. */
export function countryName(iso: string, locale: string): string {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    return names.of(iso) ?? iso;
  } catch {
    return iso;
  }
}
