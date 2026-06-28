import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ApiError } from '@/types';
import {
  descriptionSchema,
  type DescriptionInput,
} from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveDescription,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';

/** Step 5 — the public-profile copy: headline, intro and teaching style. */
export function DescriptionStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveDescription();
  const { goBack, goNext } = useStepNav('description');
  const errorText = makeErrorText(t);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DescriptionInput>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: application.description,
  });

  async function onValid(values: DescriptionInput) {
    try {
      await save.mutateAsync(values);
      goNext();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof DescriptionInput, { message: messages[0] });
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
      <Field
        label={t('onboarding.description.headline')}
        htmlFor="headline"
        error={errorText(errors.headline?.message)}
        hint={t('onboarding.description.headlineHint')}
      >
        <Input
          id="headline"
          placeholder={t('onboarding.description.headlinePlaceholder')}
          invalid={Boolean(errors.headline)}
          {...register('headline')}
        />
      </Field>

      <Field
        label={t('onboarding.description.introduction')}
        htmlFor="introduction"
        error={errorText(errors.introduction?.message)}
        hint={t('onboarding.description.introductionHint')}
      >
        <Textarea
          id="introduction"
          rows={5}
          placeholder={t('onboarding.description.introductionPlaceholder')}
          invalid={Boolean(errors.introduction)}
          {...register('introduction')}
        />
      </Field>

      <Field
        label={t('onboarding.description.teachingStyle')}
        htmlFor="teachingStyle"
        error={errorText(errors.teachingStyle?.message)}
        hint={t('onboarding.description.teachingStyleHint')}
      >
        <Textarea
          id="teachingStyle"
          rows={5}
          placeholder={t('onboarding.description.teachingStylePlaceholder')}
          invalid={Boolean(errors.teachingStyle)}
          {...register('teachingStyle')}
        />
      </Field>
    </StepShell>
  );
}
