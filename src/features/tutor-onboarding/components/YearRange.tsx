import { type UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/ui/Select';
import { yearOptions } from '../utils/onboardingOptions';

interface YearRangeProps {
  label: string;
  /** `register(...)` for the start year. */
  fromField: UseFormRegisterReturn;
  /** `register(...)` for the end year. */
  toField: UseFormRegisterReturn;
}

/** "Years of study" — a labelled pair of year selects joined by a dash. */
export function YearRange({ label, fromField, toField }: YearRangeProps) {
  const { t } = useTranslation();
  const years = yearOptions();

  return (
    <div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <Select aria-label={`${label} — ${t('onboarding.actions.from')}`} {...fromField}>
          <option value="">{t('onboarding.actions.select')}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
        <span aria-hidden className="text-gray-400">
          –
        </span>
        <Select aria-label={`${label} — ${t('onboarding.actions.to')}`} {...toField}>
          <option value="">{t('onboarding.actions.select')}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
