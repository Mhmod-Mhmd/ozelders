import { useTranslation } from 'react-i18next';
import { Toggle } from '@/components/ui/Toggle';
import { FilterPillDropdown } from './FilterPillDropdown';

interface NativeSpeakerFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function NativeSpeakerFilter({ value, onChange }: NativeSpeakerFilterProps) {
  const { t } = useTranslation();

  return (
    <FilterPillDropdown
      label={t('student.filters.nativeSpeaker')}
      checked={value}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">
            {t('student.filters.nativeSpeaker')}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {t('student.nativeSpeaker.description')}
          </p>
        </div>
        <Toggle
          checked={value}
          onChange={onChange}
          label={t('student.filters.nativeSpeaker')}
        />
      </div>
    </FilterPillDropdown>
  );
}
