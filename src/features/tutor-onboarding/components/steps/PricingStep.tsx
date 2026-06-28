import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/types';
import { useCurrency } from '@/currency';
import { paths } from '@/router/paths';
import { pricingSchema, type PricingInput } from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSavePricing,
  useSubmitApplication,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';

/** Share of the lesson price the tutor keeps after the platform service fee. */
const TUTOR_SHARE = 0.82;

/** Step 8 — set the hourly rate, then submit the whole application. */
export function PricingStep() {
  const { t, i18n } = useTranslation();
  const application = useOnboardingApplication();
  const { currency } = useCurrency();
  const locale = i18n.language;
  const savePricing = useSavePricing();
  const submit = useSubmitApplication();
  const { goBack } = useStepNav('pricing');
  const navigate = useNavigate();
  const errorText = makeErrorText(t);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<PricingInput>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      // Leave the field empty (not "0") until the tutor sets a real rate.
      hourlyRate: application.pricing.hourlyRate || undefined,
    },
  });

  const rate = watch('hourlyRate');
  const money = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  async function onValid(values: PricingInput) {
    try {
      await savePricing.mutateAsync({ ...values, currency });
      await submit.mutateAsync();
      navigate(paths.becomeTutorOnboardingSubmitted);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof PricingInput, { message: messages[0] });
        }
      }
    }
  }

  const isSubmitting = savePricing.isPending || submit.isPending;
  const showPreview = Number.isFinite(rate) && (rate as number) >= 1;

  return (
    <StepShell
      title={t('onboarding.pricing.title')}
      subtitle={t('onboarding.pricing.subtitle')}
      onSubmit={handleSubmit(onValid)}
      onBack={goBack}
      isSubmitting={isSubmitting}
      submitLabel={t('onboarding.pricing.submit')}
      serverError={
        serverErrorMessage(savePricing.error, t) ??
        serverErrorMessage(submit.error, t)
      }
    >
      <Field
        label={t('onboarding.pricing.rateLabel')}
        htmlFor="hourlyRate"
        error={errorText(errors.hourlyRate?.message)}
        hint={t('onboarding.pricing.rateHint')}
      >
        <div className="flex items-center gap-3">
          <Input
            id="hourlyRate"
            type="number"
            inputMode="numeric"
            min={3}
            max={200}
            step={1}
            className="max-w-36"
            invalid={Boolean(errors.hourlyRate)}
            {...register('hourlyRate', { valueAsNumber: true })}
          />
          <span className="text-sm font-medium text-gray-600">
            {currency} / {t('onboarding.pricing.perHour')}
          </span>
        </div>
      </Field>

      {showPreview && (
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-gray-600">
              {t('onboarding.pricing.studentsPay')}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {money(rate as number)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <span className="text-sm text-gray-600">
              {t('onboarding.pricing.youKeep')}
            </span>
            <span className="text-lg font-bold text-brand-600">
              {money(Math.round((rate as number) * TUTOR_SHARE))}
            </span>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            {t('onboarding.pricing.feeNote')}
          </p>
        </div>
      )}
    </StepShell>
  );
}
