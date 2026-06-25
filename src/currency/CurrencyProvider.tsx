import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  CurrencyContext,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from './currency';

function isSupported(value: string | null): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.some((c) => c.code === value);
}

function readStored(): CurrencyCode {
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    /* localStorage unavailable (private mode, etc.) — fall back to default. */
  }
  return DEFAULT_CURRENCY;
}

/** Provides the persisted currency preference to the app. */
export function CurrencyProvider({ children }: PropsWithChildren) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(readStored);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      /* Persisting is best-effort; the in-memory choice still applies. */
    }
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
