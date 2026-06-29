import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronDown, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/types';
import { useCurrency } from '@/currency';
import { cn } from '@/utils/cn';
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
import { SubmittedModal } from '../SubmittedModal';

/** Share of the lesson price the tutor keeps after the platform service fee. */
const TUTOR_SHARE = 0.82;
/** Suggested starting price, shown as the recommendation and field placeholder. */
const RECOMMENDED_RATE = 3;

/** Step 8 — set the 50-minute lesson price, then complete registration. */
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

  const [commissionOpen, setCommissionOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  /** The currency's symbol (e.g. "$", "₺") for the trailing input badge. */
  const symbol =
    new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((p) => p.type === 'currency')?.value ?? currency;

  async function onValid(values: PricingInput) {
    try {
      await savePricing.mutateAsync({ ...values, currency });
      await submit.mutateAsync();
      setSubmitted(true);
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
    <>
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
        <p className="text-sm text-gray-700">
          {t('onboarding.pricing.recommend', {
            price: money(RECOMMENDED_RATE),
          })}
        </p>

        <div>
          <label htmlFor="hourlyRate" className="sr-only">
            {t('onboarding.pricing.rateLabel')}
          </label>
          <div className="relative">
            <Input
              id="hourlyRate"
              type="number"
              inputMode="numeric"
              min={3}
              max={200}
              step={1}
              placeholder={String(RECOMMENDED_RATE)}
              className="pe-14"
              invalid={Boolean(errors.hourlyRate)}
              {...register('hourlyRate', { valueAsNumber: true })}
            />
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-gray-300 text-sm font-bold text-gray-700">
                {symbol}
              </span>
            </span>
          </div>
          {errors.hourlyRate ? (
            <p className="mt-1.5 text-sm text-red-500">
              {errorText(errors.hourlyRate.message)}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-gray-400">
              {t('onboarding.pricing.currencyNote', { currency })}
            </p>
          )}
        </div>

        {/* Recommendation stat */}
        <div className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{t('onboarding.pricing.statNote')}</p>
        </div>

        {/* Commission accordion */}
        <div className="rounded-2xl border border-gray-200">
          <button
            type="button"
            onClick={() => setCommissionOpen((open) => !open)}
            aria-expanded={commissionOpen}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start"
          >
            <span className="font-semibold text-gray-900">
              {t('onboarding.pricing.commissionTitle', { brand: t('brand.name') })}
            </span>
            <ChevronDown
              className={cn(
                'h-5 w-5 shrink-0 text-gray-400 transition-transform',
                commissionOpen && 'rotate-180',
              )}
            />
          </button>
          {commissionOpen && (
            <div className="border-t border-gray-100 px-4 py-4 text-sm text-gray-600">
              <p>{t('onboarding.pricing.commissionBody')}</p>
              {showPreview && (
                <dl className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt>{t('onboarding.pricing.studentsPay')}</dt>
                    <dd className="font-semibold text-gray-900">
                      {money(rate as number)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt>{t('onboarding.pricing.youKeep')}</dt>
                    <dd className="font-bold text-brand-600">
                      {money(Math.round((rate as number) * TUTOR_SHARE))}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          )}
        </div>

        {/* Final details / terms */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900">
            {t('onboarding.pricing.finalDetailsTitle')}
          </h3>
          <div className="mt-2 flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
            <p className="text-sm text-gray-600">
              {t('onboarding.pricing.terms', { brand: t('brand.name') })}
            </p>
          </div>
        </div>
      </StepShell>

      {submitted && <SubmittedModal onClose={() => navigate(paths.home)} />}
    </>
  );
}
