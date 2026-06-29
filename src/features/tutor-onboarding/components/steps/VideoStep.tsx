import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, Upload, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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

const YOUTUBE_URL = 'https://www.youtube.com/';
const VIMEO_URL = 'https://vimeo.com/';

/**
 * Step 6 — Intro video.
 *
 * Two columns: on the left a camera-preview placeholder, an upload control, a
 * link field and an optional thumbnail; on the right the Do/Don't approval
 * requirements. The video is optional (a tutor can add it later), but the full
 * upload affordance is built so swapping in a real upload endpoint is trivial.
 */
export function VideoStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const save = useSaveVideo();
  const { goBack, goNext } = useStepNav('video');
  const errorText = makeErrorText(t);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [thumbFile, setThumbFile] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema),
    defaultValues: application.video,
  });

  const dos = t('onboarding.video.do', {
    returnObjects: true,
  }) as unknown as string[];
  const donts = t('onboarding.video.dont', {
    returnObjects: true,
  }) as unknown as string[];

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
      width="wide"
      onSubmit={handleSubmit(onValid)}
      onBack={goBack}
      isSubmitting={isSubmitting}
      serverError={serverErrorMessage(save.error, t)}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left column — preview, upload, link, thumbnail */}
        <div className="flex flex-col gap-6">
          <div className="grid aspect-video w-full place-items-center overflow-hidden rounded-2xl bg-gray-900 text-center">
            {videoFile ? (
              <div className="flex flex-col items-center gap-2 px-6 text-white">
                <Video className="h-8 w-8" />
                <p className="max-w-full truncate text-sm font-medium">
                  {videoFile}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="rounded-xl border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t('onboarding.video.testCamera')}
              </button>
            )}
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setVideoFile(file.name);
              e.target.value = '';
            }}
          />
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setThumbFile(file.name);
              e.target.value = '';
            }}
          />

          {/* Upload */}
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {t('onboarding.video.addVideoTitle')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {t('onboarding.video.addVideoHint')}
            </p>
            <Button
              type="button"
              size="lg"
              onClick={() => videoInputRef.current?.click()}
              className="mt-4 w-full gap-2"
            >
              <Upload className="h-5 w-5" />
              {t('onboarding.video.uploadVideo')}
            </Button>
            {videoFile && (
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                <Check className="h-4 w-4 shrink-0 text-green-600" />
                <span className="truncate">{videoFile}</span>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  aria-label={t('onboarding.upload.remove')}
                  className="shrink-0 text-gray-400 transition-colors hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Link */}
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {t('onboarding.video.orPasteLink')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {t('onboarding.video.learnHowPrefix')}{' '}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-gray-900 underline underline-offset-2"
              >
                YouTube
              </a>{' '}
              {t('onboarding.video.orConnector')}{' '}
              <a
                href={VIMEO_URL}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-gray-900 underline underline-offset-2"
              >
                Vimeo
              </a>
            </p>
            <Field
              className="mt-3"
              label={t('onboarding.video.urlLabel')}
              htmlFor="url"
              error={errorText(errors.url?.message)}
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
          </div>

          {/* Thumbnail */}
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {t('onboarding.video.thumbnailTitle')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {t('onboarding.video.thumbnailHint')}
            </p>
            {thumbFile ? (
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                <span className="truncate">{thumbFile}</span>
                <button
                  type="button"
                  onClick={() => setThumbFile(null)}
                  aria-label={t('onboarding.upload.remove')}
                  className="shrink-0 text-gray-400 transition-colors hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                {t('onboarding.video.uploadThumbnail')}
              </button>
            )}
          </div>
        </div>

        {/* Right column — approval requirements */}
        <aside className="rounded-2xl bg-gray-50 p-5 lg:sticky lg:top-6 lg:self-start">
          <h3 className="text-base font-bold text-gray-900">
            {t('onboarding.video.requirementsTitle')}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {t('onboarding.video.requirementsHint')}
          </p>

          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-gray-900">
            <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
            {t('onboarding.video.doLabel')}
          </p>
          <ul className="mt-2 space-y-2">
            {dos.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400"
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-gray-900">
            <X className="h-4 w-4 text-red-500" strokeWidth={3} />
            {t('onboarding.video.dontLabel')}
          </p>
          <ul className="mt-2 space-y-2">
            {donts.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400"
                />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </StepShell>
  );
}
