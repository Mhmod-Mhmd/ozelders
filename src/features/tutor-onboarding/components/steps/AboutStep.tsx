import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ApiError } from '@/types';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { PhoneField } from '@/features/account/components/PhoneField';
import { aboutSchema, type AboutInput } from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveAbout,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import {
  COUNTRIES,
  EMPTY_LANGUAGE,
  LANGUAGE_OPTIONS,
  LEVELS,
} from '../../utils/onboardingOptions';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';
import { FormCheckbox } from '../FormCheckbox';

/** Step 1 — identity, country, subject, spoken languages, phone, age check. */
export function AboutStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveAbout();
  const { goNext } = useStepNav('about');
  const { data: subjects = [] } = useSubjects();
  const errorText = makeErrorText(t);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AboutInput>({
    resolver: zodResolver(aboutSchema),
    defaultValues: application.about,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
  });
  const phoneCountry = watch('phoneCountry');

  async function onValid(values: AboutInput) {
    try {
      await save.mutateAsync(values);
      goNext();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof AboutInput, { message: messages[0] });
        }
      }
    }
  }

  return (
    <StepShell
      title={t('onboarding.about.title')}
      subtitle={t('onboarding.about.subtitle')}
      onSubmit={handleSubmit(onValid)}
      isSubmitting={isSubmitting}
      serverError={serverErrorMessage(save.error, t)}
    >
      <Field
        label={t('onboarding.about.firstName')}
        htmlFor="firstName"
        error={errorText(errors.firstName?.message)}
      >
        <Input
          id="firstName"
          autoComplete="given-name"
          invalid={Boolean(errors.firstName)}
          {...register('firstName')}
        />
      </Field>

      <Field
        label={t('onboarding.about.lastName')}
        htmlFor="lastName"
        error={errorText(errors.lastName?.message)}
      >
        <Input
          id="lastName"
          autoComplete="family-name"
          invalid={Boolean(errors.lastName)}
          {...register('lastName')}
        />
      </Field>

      <Field
        label={t('onboarding.about.email')}
        htmlFor="email"
        error={errorText(errors.email?.message)}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </Field>

      <Field
        label={t('onboarding.about.country')}
        htmlFor="country"
        error={errorText(errors.country?.message)}
      >
        <Select id="country" {...register('country')}>
          <option value="">{t('onboarding.about.countryPlaceholder')}</option>
          {COUNTRIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.flag} {t(`student.countries.${c.name}`, c.name)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label={t('onboarding.about.subject')}
        htmlFor="subject"
        error={errorText(errors.subject?.message)}
      >
        <Select id="subject" {...register('subject')}>
          <option value="">{t('onboarding.about.subjectPlaceholder')}</option>
          {subjects.map((s) => (
            <option key={s.key} value={s.key}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>

      {/* Spoken languages — repeatable language + level rows. */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <span className="text-sm font-medium text-gray-700">
              {t('onboarding.about.languagesLabel')}
            </span>
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {t('onboarding.about.levelLabel')}
            </span>
          </div>
          <span className="w-10 shrink-0" aria-hidden />
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Select
                  aria-label={t('onboarding.about.languagesLabel')}
                  aria-invalid={
                    Boolean(errors.languages?.[index]?.language) || undefined
                  }
                  {...register(`languages.${index}.language`)}
                >
                  <option value="">
                    {t('onboarding.about.languagePlaceholder')}
                  </option>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {t(`student.languages.${lang}`, lang)}
                    </option>
                  ))}
                </Select>
                {errors.languages?.[index]?.language && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errorText(errors.languages[index]?.language?.message)}
                  </p>
                )}
              </div>
              <Select
                aria-label={t('onboarding.about.levelLabel')}
                {...register(`languages.${index}.level`)}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {t(`onboarding.levels.${level}`)}
                  </option>
                ))}
              </Select>
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={t('onboarding.about.removeLanguage')}
              disabled={fields.length === 1}
              className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {typeof errors.languages?.message === 'string' && (
          <p className="text-sm text-red-500">
            {errorText(errors.languages.message)}
          </p>
        )}

        <button
          type="button"
          onClick={() => append(EMPTY_LANGUAGE)}
          className="self-start text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
        >
          {t('onboarding.about.addLanguage')}
        </button>
      </div>

      <Field
        label={t('onboarding.about.phone')}
        htmlFor="phoneNumber"
        error={errorText(errors.phoneNumber?.message)}
        hint={t('onboarding.about.phoneOptional')}
      >
        <PhoneField
          id="phoneNumber"
          country={phoneCountry}
          onCountryChange={(iso) =>
            setValue('phoneCountry', iso, { shouldDirty: true })
          }
          numberField={register('phoneNumber')}
          invalid={Boolean(errors.phoneNumber)}
        />
      </Field>

      <div>
        <FormCheckbox
          id="over18"
          label={t('onboarding.about.over18')}
          {...register('over18')}
        />
        {errors.over18 && (
          <p className="mt-1.5 text-sm text-red-500">
            {errorText(errors.over18.message)}
          </p>
        )}
      </div>
    </StepShell>
  );
}
