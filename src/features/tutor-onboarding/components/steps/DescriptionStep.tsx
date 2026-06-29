import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ApiError } from '@/types';
import { cn } from '@/utils/cn';
import {
  DESCRIPTION_LIMITS,
  DESCRIPTION_SECTIONS,
  descriptionSchema,
  type DescriptionInput,
  type DescriptionSection,
} from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveDescription,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';

/**
 * Step 5 — Description.
 *
 * The public-profile copy is captured as a four-section accordion checklist
 * (introduce yourself, teaching experience, student motivation, headline). Each
 * section validates on its own "Continue" and shows a live character counter; a
 * ✓ marks sections that meet their minimum. The footer saves all four at once.
 */
export function DescriptionStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveDescription();
  const { goBack, goNext } = useStepNav('description');
  const errorText = makeErrorText(t);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DescriptionInput>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: application.description,
  });

  const [open, setOpen] = useState<DescriptionSection | null>(
    DESCRIPTION_SECTIONS[0],
  );
  const values = watch();

  /** Validate the current section; if it passes, jump to the next one. */
  async function continueSection(section: DescriptionSection, nextIndex: number) {
    if (!(await trigger(section))) return;
    setOpen(DESCRIPTION_SECTIONS[nextIndex] ?? null);
  }

  async function onValid(values: DescriptionInput) {
    try {
      await save.mutateAsync(values);
      goNext();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof DescriptionInput, { message: messages[0] });
          setOpen(field as DescriptionSection);
        }
      }
    }
  }

  return (
    <StepShell
      title={t('onboarding.description.title')}
      subtitle={t('onboarding.description.subtitle')}
      onSubmit={handleSubmit(onValid)}
      onBack={goBack}
      isSubmitting={isSubmitting}
      serverError={serverErrorMessage(save.error, t)}
    >
      <div className="flex flex-col">
        {DESCRIPTION_SECTIONS.map((section, index) => {
          const limit = DESCRIPTION_LIMITS[section];
          const value = values[section] ?? '';
          const done = value.trim().length >= limit.min;
          const isOpen = open === section;

          return (
            <div
              key={section}
              className="border-t border-gray-100 py-5 first:border-t-0 first:pt-0"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : section)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 text-start"
              >
                <span className="text-base font-bold text-gray-900 sm:text-lg">
                  {index + 1}. {t(`onboarding.description.sections.${section}.title`)}
                </span>
                {done ? (
                  <Check
                    className="h-5 w-5 shrink-0 text-gray-900"
                    strokeWidth={3}
                  />
                ) : (
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-gray-400 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                )}
              </button>

              {isOpen && (
                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-sm text-gray-600">
                    {t(`onboarding.description.sections.${section}.prompt`)}
                  </p>
                  <Textarea
                    rows={5}
                    maxLength={limit.max}
                    placeholder={t(
                      `onboarding.description.sections.${section}.placeholder`,
                    )}
                    invalid={Boolean(errors[section])}
                    {...register(section)}
                  />
                  {errors[section] && (
                    <p className="text-sm text-red-500">
                      {errorText(errors[section]?.message)}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        done ? 'text-brand-600' : 'text-gray-400',
                      )}
                    >
                      {value.length} / {limit.max}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => continueSection(section, index + 1)}
                    >
                      {t('onboarding.description.continue')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}
