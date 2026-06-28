import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, Video } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/types';
import { videoSchema, type VideoInput } from '../../types/onboarding.types';
import {
  useOnboardingApplication,
  useSaveVideo,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { makeErrorText, serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';

/** Intro-video tips, in display order. */
const TIPS = ['keepShort', 'goodLighting', 'faceCamera', 'introYourself'] as const;

/** Step 6 — an optional intro-video link plus filming tips. */
export function VideoStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveVideo();
  const { goBack, goNext } = useStepNav('video');
  const errorText = makeErrorText(t);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema),
    defaultValues: application.video,
  });

  async function onValid(values: VideoInput) {
    try {
      await save.mutateAsync(values);
      goNext();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof VideoInput, { message: messages[0] });
        }
      }
    }
  }

  return (
    <StepShell
      title={t('onboarding.video.title')}
      subtitle={t('onboarding.video.subtitle')}
      onSubmit={handleSubmit(onValid)}
      onBack={goBack}
      isSubmitting={isSubmitting}
      serverError={serverErrorMessage(save.error, t)}
    >
      <div className="grid aspect-video w-full place-items-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
        <div className="flex flex-col items-center gap-2 px-6 text-gray-500">
          <Video className="h-8 w-8" />
          <p className="text-sm font-medium">
            {t('onboarding.video.placeholder')}
          </p>
        </div>
      </div>

      <Field
        label={t('onboarding.video.urlLabel')}
        htmlFor="url"
        error={errorText(errors.url?.message)}
        hint={t('onboarding.video.urlHint')}
      >
        <Input
          id="url"
          type="url"
          inputMode="url"
          placeholder={t('onboarding.video.urlPlaceholder')}
          invalid={Boolean(errors.url)}
          {...register('url')}
        />
      </Field>

      <div>
        <h3 className="text-sm font-bold text-gray-900">
          {t('onboarding.video.tipsTitle')}
        </h3>
        <ul className="mt-3 space-y-2.5">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2.5 text-sm text-gray-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
              {t(`onboarding.video.tips.${tip}`)}
            </li>
          ))}
        </ul>
      </div>
    </StepShell>
  );
}
