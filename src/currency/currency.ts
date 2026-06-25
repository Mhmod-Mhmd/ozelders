import { createContext, useContext } from 'react';

/**
 * Currency model + context (no components, so it stays fast-refresh friendly).
 * Prices are stored in USD in the mock "database" and converted to the active
 * currency at display time with `Intl`. Adding a currency later = one entry in
 * `SUPPORTED_CURRENCIES`, no feature changes.
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', label: 'USD', rate: 1 },
  { code: 'EUR', label: 'EUR', rate: 0.92 },
  { code: 'GBP', label: 'GBP', rate: 0.79 },
  { code: 'TRY', label: 'TRY', rate: 46 },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]['code'];

export const CURRENCY_STORAGE_KEY = 'ozelders.currency';
export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** Access the active currency and a setter. */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}

/**
 * Convert a USD amount to the given currency and format it for the locale,
 * keeping the narrow symbol (₺, $, €, £) and no fractional digits.
 */
export function formatPrice(
  amountUsd: number,
  currency: CurrencyCode,
  locale: string,
): string {
  const rate =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.rate ?? 1;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amountUsd * rate);
}
