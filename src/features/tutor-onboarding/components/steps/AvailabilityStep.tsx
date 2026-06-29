import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { cn } from '@/utils/cn';
import { timezoneLabel } from '@/features/account/utils/timezones';
import { type Weekday } from '@/features/tutors/types/tutor.types';
import { type WeeklySchedule } from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveAvailability,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import {
  DEFAULT_TIME_RANGE,
  TIME_OPTIONS,
  TIMEZONES,
  WEEKDAYS,
  detectTimezone,
} from '../../utils/onboardingOptions';
import { serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';
import { FormCheckbox } from '../FormCheckbox';

/** How the timezone block is presented: asking, confirmed, or being edited. */
type TimezoneMode = 'ask' | 'confirmed' | 'editing';

/**
 * Step 7 — Availability.
 *
 * First confirms the tutor's timezone ("Is this your current timezone?"), then
 * lets them toggle each weekday on/off and add one or more From–To working
 * blocks per day. A correct timezone plus at least one block is required.
 */
export function AvailabilityStep() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const application = useOnboardingApplication();
  const save = useSaveAvailability();
  const { goBack, goNext } = useStepNav('availability');

  const [timezone, setTimezone] = useState(
    application.availability.timezone || detectTimezone(),
  );
  const [tzMode, setTzMode] = useState<TimezoneMode>('ask');
  const [schedule, setSchedule] = useState<WeeklySchedule>(
    application.availability.schedule,
  );
  const [error, setError] = useState<string | null>(null);

  function patchDay(day: Weekday, next: Partial<WeeklySchedule[string]>) {
    setError(null);
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], ...next } }));
  }

  function toggleDay(day: Weekday) {
    const current = schedule[day];
    patchDay(day, {
      enabled: !current.enabled,
      slots:
        !current.enabled && current.slots.length === 0
          ? [{ ...DEFAULT_TIME_RANGE }]
          : current.slots,
    });
  }

  function addSlot(day: Weekday) {
    patchDay(day, { slots: [...schedule[day].slots, { ...DEFAULT_TIME_RANGE }] });
  }

  function removeSlot(day: Weekday, index: number) {
    patchDay(day, {
      slots: schedule[day].slots.filter((_, i) => i !== index),
    });
  }

  function updateSlot(
    day: Weekday,
    index: number,
    field: 'from' | 'to',
    value: string,
  ) {
    patchDay(day, {
      slots: schedule[day].slots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    });
  }

  function validate(): string | null {
    if (!timezone) return 'onboarding.errors.timezoneRequired';
    const enabled = WEEKDAYS.filter((d) => schedule[d]?.enabled);
    if (!enabled.some((d) => schedule[d].slots.length > 0)) {
      return 'onboarding.errors.availabilityRequired';
    }
    for (const d of enabled) {
      for (const slot of schedule[d].slots) {
        if (!slot.from || !slot.to || slot.from >= slot.to) {
          return 'onboarding.errors.timeRangeInvalid';
        }
      }
    }
    return null;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(t(problem));
      return;
    }
    await save.mutateAsync({ timezone, schedule });
    goNext();
  }

  return (
    <StepShell
      title={t('onboarding.availability.title')}
      onSubmit={onSubmit}
      onBack={goBack}
      isSubmitting={save.isPending}
      serverError={error ?? serverErrorMessage(save.error, t)}
    >
      {tzMode === 'ask' ? (
        <div className="rounded-2xl bg-gray-50 p-6 text-center">
          <p className="text-base font-bold text-gray-900">
            {t('onboarding.availability.confirmTimezone')}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {timezoneLabel(timezone, locale)}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTzMode('editing')}
            >
              {t('onboarding.availability.no')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTzMode('confirmed')}
            >
              {t('onboarding.availability.yes')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Timezone */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('onboarding.availability.setTimezone')}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t('onboarding.availability.timezoneHint')}
            </p>
            {tzMode === 'confirmed' ? (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <span className="text-sm font-medium text-gray-800">
                  {timezoneLabel(timezone, locale)}
                </span>
                <button
                  type="button"
                  onClick={() => setTzMode('editing')}
                  className="shrink-0 text-sm font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700"
                >
                  {t('onboarding.availability.change')}
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <label htmlFor="timezone" className="sr-only">
                  {t('onboarding.availability.chooseTimezone')}
                </label>
                <Select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => {
                    setError(null);
                    setTimezone(e.currentTarget.value);
                  }}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {timezoneLabel(tz, locale)}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {/* Weekly availability */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('onboarding.availability.setAvailability')}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t('onboarding.availability.availabilityHint')}
            </p>

            <div className="mt-4 flex flex-col">
              {WEEKDAYS.map((day) => {
                const { enabled, slots } = schedule[day];
                return (
                  <div
                    key={day}
                    className="border-t border-gray-100 py-5 first:border-t-0 first:pt-0"
                  >
                    <FormCheckbox
                      id={`day-${day}`}
                      checked={enabled}
                      onChange={() => toggleDay(day)}
                      label={t(`weekdaysLong.${day}`)}
                    />

                    {enabled && (
                      <div className="mt-4 flex flex-col gap-3 ps-8">
                        {slots.map((slot, index) => (
                          <div key={index} className="flex items-end gap-2">
                            <div className="grid flex-1 grid-cols-2 gap-3">
                              <SlotSelect
                                label={t('onboarding.availability.from')}
                                value={slot.from}
                                onChange={(v) =>
                                  updateSlot(day, index, 'from', v)
                                }
                              />
                              <SlotSelect
                                label={t('onboarding.availability.to')}
                                value={slot.to}
                                onChange={(v) =>
                                  updateSlot(day, index, 'to', v)
                                }
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSlot(day, index)}
                              aria-label={t(
                                'onboarding.availability.removeTimeslot',
                              )}
                              disabled={slots.length === 1}
                              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSlot(day)}
                          className="self-start text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
                        >
                          {t('onboarding.availability.addTimeslot')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </StepShell>
  );
}

interface SlotSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** One labelled time `<select>` (From / To) for an availability block. */
function SlotSelect({ label, value, onChange }: SlotSelectProps) {
  return (
    <label className="block">
      <span
        className={cn(
          'mb-1 block text-xs font-medium text-gray-500',
          'text-start',
        )}
      >
        {label}
      </span>
      <Select value={value} onChange={(e) => onChange(e.currentTarget.value)}>
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </Select>
    </label>
  );
}
