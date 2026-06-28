import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  type Availability,
  type AvailabilityPeriod,
  type Weekday,
} from '@/features/tutors/types/tutor.types';
import { availabilitySchema } from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveAvailability,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { WEEKDAYS } from '../../utils/onboardingOptions';
import { serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';

const PERIODS: AvailabilityPeriod[] = [
  'morning',
  'afternoon',
  'evening',
  'night',
];

/** Step 7 — pick the weekly time blocks the tutor is available to teach. */
export function AvailabilityStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveAvailability();
  const { goBack, goNext } = useStepNav('availability');

  const [availability, setAvailability] = useState<Availability>(
    application.availability.availability,
  );
  const [error, setError] = useState<string | null>(null);

  function toggle(day: Weekday, period: AvailabilityPeriod) {
    setError(null);
    setAvailability((prev) => {
      const active = prev[day].includes(period);
      return {
        ...prev,
        [day]: active
          ? prev[day].filter((p) => p !== period)
          : [...prev[day], period],
      };
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = availabilitySchema.safeParse({ availability });
    if (!result.success) {
      setError(
        t(
          result.error.issues[0]?.message ??
            'onboarding.errors.availabilityRequired',
        ),
      );
      return;
    }
    await save.mutateAsync(availability);
    goNext();
  }

  return (
    <StepShell
      title={t('onboarding.availability.title')}
      subtitle={t('onboarding.availability.subtitle')}
      onSubmit={onSubmit}
      onBack={goBack}
      isSubmitting={save.isPending}
      serverError={error ?? serverErrorMessage(save.error, t)}
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[560px] grid-cols-[7rem_repeat(7,minmax(0,1fr))] gap-1.5">
          {/* Header row: empty corner + weekday labels */}
          <span aria-hidden />
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="pb-1 text-center text-xs font-semibold text-gray-500"
            >
              {t(`weekdays.${day}`)}
            </span>
          ))}

          {/* One row per period */}
          {PERIODS.map((period) => (
            <Row
              key={period}
              periodLabel={t(`tutors.periods.${period}`)}
              cells={WEEKDAYS.map((day) => ({
                day,
                active: availability[day].includes(period),
                onClick: () => toggle(day, period),
                label: `${t(`weekdays.${day}`)} · ${t(`tutors.periods.${period}`)}`,
              }))}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="h-3 w-3 rounded bg-brand-500" />
        {t('onboarding.availability.selectedLegend')}
      </div>
    </StepShell>
  );
}

interface RowProps {
  periodLabel: string;
  cells: {
    day: Weekday;
    active: boolean;
    onClick: () => void;
    label: string;
  }[];
}

function Row({ periodLabel, cells }: RowProps) {
  return (
    <>
      <span className="flex items-center text-xs font-semibold text-gray-700">
        {periodLabel}
      </span>
      {cells.map((cell) => (
        <button
          key={cell.day}
          type="button"
          role="switch"
          aria-checked={cell.active}
          aria-label={cell.label}
          onClick={cell.onClick}
          className={cn(
            'grid h-11 place-items-center rounded-lg border transition-colors',
            cell.active
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-gray-200 bg-white text-transparent hover:border-gray-300',
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </button>
      ))}
    </>
  );
}
