import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ApiError } from '@/types';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import {
  certificationSchema,
  type CertificationInput,
} from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveCertification,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { CERTIFICATES, EMPTY_CERTIFICATE } from '../../utils/onboardingOptions';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';
import { FormCheckbox } from '../FormCheckbox';
import { YearRange } from '../YearRange';
import { VerifiedBadgeUpload } from '../VerifiedBadgeUpload';

/** The certificate rows to seed the form with: none when the tutor has none,
 *  their saved rows, otherwise a single blank row to fill in. */
function initialCertificates(
  certification: CertificationInput,
): CertificationInput['certificates'] {
  if (certification.hasNone) return [];
  return certification.certificates.length
    ? certification.certificates
    : [EMPTY_CERTIFICATE];
}

/** Step 3 — optional teaching certificates (repeatable), or "I have none". */
export function CertificationStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveCertification();
  const { goBack, goNext } = useStepNav('certification');
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
  } = useForm<CertificationInput>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      hasNone: application.certification.hasNone,
      certificates: initialCertificates(application.certification),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'certificates',
  });
  const hasNone = watch('hasNone');

  function toggleHasNone(checked: boolean) {
    setValue('hasNone', checked);
    if (checked) replace([]);
    else if (fields.length === 0) replace([EMPTY_CERTIFICATE]);
  }

  async function onValid(values: CertificationInput) {
    try {
      await save.mutateAsync(
        values.hasNone ? { hasNone: true, certificates: [] } : values,
      );
      goNext();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof CertificationInput, {
            message: messages[0],
          });
        }
      }
    }
  }

  return (
    <StepShell
      title={t('onboarding.certification.title')}
      subtitle={
        hasNone
          ? t('onboarding.certification.subtitleNone')
          : t('onboarding.certification.subtitle')
      }
      onSubmit={handleSubmit(onValid)}
      onBack={goBack}
      isSubmitting={isSubmitting}
      serverError={serverErrorMessage(save.error, t)}
    >
      <FormCheckbox
        id="cert-none"
        checked={hasNone}
        onChange={(e) => toggleHasNone(e.currentTarget.checked)}
        label={t('onboarding.certification.noCertificate')}
      />

      {!hasNone && (
        <>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-5 border-t border-gray-100 pt-6 first:border-t-0 first:pt-0"
            >
              {/* Subject + remove */}
              <div>
                <label
                  htmlFor={`cert-subject-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {t('onboarding.certification.subject')}
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Select
                    id={`cert-subject-${index}`}
                    className="flex-1"
                    {...register(`certificates.${index}.subject`)}
                  >
                    <option value="">
                      {t('onboarding.certification.subjectPlaceholder')}
                    </option>
                    {subjects.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={t('onboarding.certification.remove')}
                    disabled={fields.length === 1}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {errors.certificates?.[index]?.subject && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errorText(errors.certificates[index]?.subject?.message)}
                  </p>
                )}
              </div>

              <Field
                label={t('onboarding.certification.certificate')}
                htmlFor={`cert-cert-${index}`}
                error={errorText(
                  errors.certificates?.[index]?.certificate?.message,
                )}
              >
                <Select
                  id={`cert-cert-${index}`}
                  {...register(`certificates.${index}.certificate`)}
                >
                  <option value="">
                    {t('onboarding.certification.certificatePlaceholder')}
                  </option>
                  {CERTIFICATES.map((c) => (
                    <option key={c} value={c}>
                      {t(`onboarding.certificates.${c}`)}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label={t('onboarding.certification.description')}
                htmlFor={`cert-desc-${index}`}
              >
                <Textarea
                  id={`cert-desc-${index}`}
                  rows={3}
                  {...register(`certificates.${index}.description`)}
                />
              </Field>

              <Field
                label={t('onboarding.certification.issuedBy')}
                htmlFor={`cert-issuer-${index}`}
              >
                <Input
                  id={`cert-issuer-${index}`}
                  {...register(`certificates.${index}.issuedBy`)}
                />
              </Field>

              <YearRange
                label={t('onboarding.certification.years')}
                fromField={register(`certificates.${index}.yearFrom`)}
                toField={register(`certificates.${index}.yearTo`)}
              />

              <VerifiedBadgeUpload
                title={t('onboarding.certification.verifyTitle')}
                description={t('onboarding.certification.verifyBody')}
              />
            </div>
          ))}

          {typeof errors.certificates?.message === 'string' && (
            <p className="text-sm text-red-500">
              {errorText(errors.certificates.message)}
            </p>
          )}

          <button
            type="button"
            onClick={() => append(EMPTY_CERTIFICATE)}
            className="self-start text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
          >
            {t('onboarding.certification.addAnother')}
          </button>
        </>
      )}
    </StepShell>
  );
}
