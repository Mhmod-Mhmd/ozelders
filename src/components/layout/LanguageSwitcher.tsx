import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import {
  SUPPORTED_CURRENCIES,
  useCurrency,
  type CurrencyCode,
} from '@/currency';
import { cn } from '@/utils/cn';
import { usePopover } from '@/hooks';

/**
 * Language + currency picker shown in the student header. The trigger reads
 * e.g. "English, USD"; the panel holds a labelled dropdown for each. Language
 * updates strings + document direction (persisted by the i18n detector);
 * currency is persisted by the currency provider.
 */

/** Labelled native select styled to match the panel design. */
function Field({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <div className="relative mt-1.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pe-9 ps-3 text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 focus-visible:border-brand-400 focus-visible:outline-none"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    </label>
  );
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const {
    open,
    setOpen,
    containerRef,
    panelId: menuId,
  } = usePopover<HTMLDivElement>();

  const active =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ??
    SUPPORTED_LANGUAGES[0];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${t('language.label')}, ${t('currency.label')}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
      >
        {active.label}, {currency}
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <div
          id={menuId}
          role="dialog"
          aria-label={`${t('language.label')} / ${t('currency.label')}`}
          className="absolute end-0 top-full z-50 mt-2 w-64 space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5"
        >
          <Field
            label={t('language.label')}
            value={active.code}
            onChange={(code) => void i18n.changeLanguage(code)}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </Field>

          <Field
            label={t('currency.label')}
            value={currency}
            onChange={(code) => setCurrency(code as CurrencyCode)}
          >
            {SUPPORTED_CURRENCIES.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.label}
              </option>
            ))}
          </Field>
        </div>
      )}
    </div>
  );
}
