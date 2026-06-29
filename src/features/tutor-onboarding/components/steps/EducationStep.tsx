import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ApiError } from '@/types';
import {
  educationSchema,
  type EducationInput,
} from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveEducation,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { DEGREE_TYPES, EMPTY_EDUCATION } from '../../utils/onboardingOptions';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';
import { FormCheckbox } from '../FormCheckbox';
import { YearRange } from '../YearRange';
import { VerifiedBadgeUpload } from '../VerifiedBadgeUpload';

/** The education rows to seed the form with: none when the tutor has none,
 *  their saved rows, otherwise a single blank row to fill in. */
function initialEducations(
  education: EducationInput,
): EducationInput['educations'] {
  if (education.hasNone) return [];
  return education.educations.length ? education.educations : [EMPTY_EDUCATION];
}

/** Step 4 — optional higher-education entries (repeatable), or "I have none". */
export function EducationStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveEducation();
  const { goBack, goNext } = useStepNav('education');
  const errorText = makeErrorText(t);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      hasNone: application.education.hasNone,
      educations: initialEducations(application.education),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'educations',
  });
  const hasNone = watch('hasNone');

  function toggleHasNone(checked: boolean) {
    setValue('hasNone', checked);
    if (checked) replace([]);
    else if (fields.length === 0) replace([EMPTY_EDUCATION]);
  }

  async function onValid(values: EducationInput) {
    try {
      await save.mutateAsync(
        values.hasNone ? { hasNone: true, educations: [] } : values,
      );
      goNext();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof EducationInput, { message: messages[0] });
        }
      }
    }
  }

  return (
    <StepShell
      title={t('onboarding.education.title')}
      subtitle={t('onboarding.education.subtitle')}
      onSubmit={handleSubmit(onValid)}
      onBack={goBack}
      isSubmitting={isSubmitting}
      serverError={serverErrorMessage(save.error, t)}
    >
      <FormCheckbox
        id="edu-none"
        checked={hasNone}
        onChange={(e) => toggleHasNone(e.currentTarget.checked)}
        label={t('onboarding.education.noDegree')}
      />

      {!hasNone && (
        <>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-5 border-t border-gray-100 pt-6 first:border-t-0 first:pt-0"
            >
              {/* University + remove */}
              <div>
                <label
                  htmlFor={`edu-university-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {t('onboarding.education.university')}
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Input
                    id={`edu-university-${index}`}
                    className="flex-1"
                    placeholder={t('onboarding.education.universityPlaceholder')}
                    invalid={Boolean(errors.educations?.[index]?.university)}
                    {...register(`educations.${index}.university`)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={t('onboarding.education.remove')}
                    disabled={fields.length === 1}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {errors.educations?.[index]?.university && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errorText(errors.educations[index]?.university?.message)}
                  </p>
                )}
              </div>

              <Field
                label={t('onboarding.education.degree')}
                htmlFor={`edu-degree-${index}`}
                error={errorText(errors.educations?.[index]?.degree?.message)}
              >
                <Input
                  id={`edu-degree-${index}`}
                  placeholder={t('onboarding.education.degreePlaceholder')}
                  invalid={Boolean(errors.educations?.[index]?.degree)}
                  {...register(`educations.${index}.degree`)}
                />
              </Field>

              <Field
                label={t('onboarding.education.degreeType')}
                htmlFor={`edu-degreeType-${index}`}
                error={errorText(
                  errors.educations?.[index]?.degreeType?.message,
                )}
              >
                <Select
                  id={`edu-degreeType-${index}`}
                  {...register(`educations.${index}.degreeType`)}
                >
                  <option value="">
                    {t('onboarding.education.degreeTypePlaceholder')}
                  </option>
                  {DEGREE_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {t(`onboarding.degreeTypes.${d}`)}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label={t('onboarding.education.specialization')}
                htmlFor={`edu-spec-${index}`}
              >
                <Input
                  id={`edu-spec-${index}`}
                  placeholder={t(
                    'onboarding.education.specializationPlaceholder',
                  )}
                  {...register(`educations.${index}.specialization`)}
                />
              </Field>

              <YearRange
                label={t('onboarding.education.years')}
                fromField={register(`educations.${index}.yearFrom`)}
                toField={register(`educations.${index}.yearTo`)}
              />

              <VerifiedBadgeUpload
                title={t('onboarding.education.verifyTitle')}
                description={t('onboarding.education.verifyBody')}
              />
            </div>
          ))}

          {typeof errors.educations?.message === 'string' && (
            <p className="text-sm text-red-500">
              {errorText(errors.educations.message)}
            </p>
          )}

          <button
            type="button"
            onClick={() => append(EMPTY_EDUCATION)}
            className="self-start text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
          >
            {t('onboarding.education.addAnother')}
          </button>
        </>
      )}
    </StepShell>
  );
}
