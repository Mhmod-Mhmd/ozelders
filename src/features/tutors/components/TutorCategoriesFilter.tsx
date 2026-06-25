import { useTranslation } from 'react-i18next';
import { Award, BadgeCheck } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { FilterPillDropdown } from './FilterPillDropdown';
import { type TutorCategorySelection } from '../utils/filterOptions';

interface TutorCategoriesFilterProps {
  value: TutorCategorySelection;
  onChange: (value: TutorCategorySelection) => void;
}

export function TutorCategoriesFilter({
  value,
  onChange,
}: TutorCategoriesFilterProps) {
  const { t } = useTranslation();
  const count = Number(value.superTutor) + Number(value.professional);

  const rows = [
    {
      key: 'superTutor' as const,
      icon: <Award className="h-5 w-5 text-rose-500" />,
      title: t('student.categories.superTutor.title'),
      description: t('student.categories.superTutor.description'),
    },
    {
      key: 'professional' as const,
      icon: <BadgeCheck className="h-5 w-5 text-brand-600" />,
      title: t('student.categories.professional.title'),
      description: t('student.categories.professional.description'),
    },
  ];

  return (
    <FilterPillDropdown
      label={t('student.filters.tutorCategories')}
      count={count}
    >
      <div className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                {row.icon}
                {row.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{row.description}</p>
            </div>
            <Toggle
              checked={value[row.key]}
              onChange={(checked) => onChange({ ...value, [row.key]: checked })}
              label={row.title}
            />
          </div>
        ))}
      </div>
    </FilterPillDropdown>
  );
}
