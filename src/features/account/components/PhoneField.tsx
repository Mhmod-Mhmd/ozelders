import { type UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  PHONE_COUNTRIES,
  countryName,
  findPhoneCountry,
} from '../utils/phoneCountries';

interface PhoneFieldProps {
  id: string;
  /** Selected ISO country code. */
  country: string;
  onCountryChange: (iso: string) => void;
  /** Result of `register('phoneNumber')`, spread onto the number input. */
  numberField: UseFormRegisterReturn;
  invalid?: boolean;
}

/**
 * Combined country dial-code selector + national number input, presented as a
 * single bordered control. The selected country shows its flag and dial code,
 * mirroring the design.
 */
export function PhoneField({
  id,
  country,
  onCountryChange,
  numberField,
  invalid,
}: PhoneFieldProps) {
  const { t, i18n } = useTranslation();
  const selected = findPhoneCountry(country);

  return (
    <div
      className={cn(
        'flex items-stretch rounded-xl border bg-white transition-colors focus-within:border-brand-400',
        invalid ? 'border-red-400' : 'border-gray-200',
      )}
    >
      <div className="relative flex items-center">
        <select
          aria-label={t('settings.account.phone.countryLabel')}
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="cursor-pointer appearance-none rounded-s-xl bg-transparent py-2.5 ps-3.5 pe-7 text-sm font-medium text-gray-800 focus-visible:outline-none"
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} {c.dial} — {countryName(c.iso, i18n.language)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <span aria-hidden className="my-2 w-px self-stretch bg-gray-200" />

      <span className="flex items-center ps-3 text-sm font-medium text-gray-500">
        {selected.dial}
      </span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={t('settings.account.phone.placeholder')}
        className="min-w-0 flex-1 rounded-e-xl bg-transparent px-2 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none"
        {...numberField}
      />
    </div>
  );
}
