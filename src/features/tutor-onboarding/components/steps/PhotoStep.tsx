import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Check, GraduationCap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import {
  useOnboardingApplication,
  useSavePhoto,
} from '../../hooks/useOnboarding';
import { useStepNav } from '../../hooks/useStepNav';
import { countryFlag } from '../../utils/onboardingOptions';
import { serverErrorMessage } from '../../utils/errorText';
import { StepShell } from '../StepShell';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png'];

/** The four "good example" headshots shown under the guidelines. */
const EXAMPLES = [45, 12, 47, 33];

/** Photo-guidance bullet keys, in display order. */
const CHECKLIST = [
  'facingForward',
  'headShoulders',
  'centered',
  'faceVisible',
  'onlyPerson',
  'colorPhoto',
  'avoidLogos',
] as const;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Step 2 — profile photo upload, with a live preview and quality checklist. */
export function PhotoStep() {
  const { t } = useTranslation();
  const application = useOnboardingApplication();
  const { about, photo } = application;
  const { data: subjects = [] } = useSubjects();
  const save = useSavePhoto();
  const { goBack, goNext } = useStepNav('photo');

  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState(photo.photoUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fullName = `${about.firstName} ${about.lastName}`.trim();
  const subjectName =
    subjects.find((s) => s.key === about.subject)?.name || about.subject;
  const speaks = about.languages
    .filter((l) => l.language)
    .map(
      (l) =>
        `${t(`student.languages.${l.language}`, l.language)} (${t(
          `onboarding.levels.${l.level}`,
        )})`,
    )
    .join(', ');

  async function handleFile(file: File) {
    setUploadError(null);
    if (!ACCEPTED.includes(file.type)) {
      setUploadError(t('onboarding.photo.errorType'));
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError(t('onboarding.photo.errorSize'));
      return;
    }
    setPhotoUrl(await readFileAsDataUrl(file));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await save.mutateAsync({ photoUrl });
    goNext();
  }

  return (
    <StepShell
      title={t('onboarding.photo.title')}
      subtitle={t('onboarding.photo.subtitle')}
      onSubmit={onSubmit}
      onBack={goBack}
      isSubmitting={save.isPending}
      serverError={serverErrorMessage(save.error, t)}
    >
      {/* Preview card */}
      <div className="flex flex-col items-start gap-5 border-y border-gray-100 py-6 sm:flex-row sm:items-center">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName}
            className="h-28 w-28 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-gray-300 p-2 text-center text-xs font-medium text-gray-400">
            {t('onboarding.photo.placeholder')}
          </div>
        )}

        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xl font-bold text-gray-900">
            {fullName || t('onboarding.photo.yourName')}
            <span aria-hidden className="text-lg">
              {countryFlag(about.country)}
            </span>
          </p>
          {subjectName && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              {t('onboarding.photo.teaches', { subject: subjectName })}
            </p>
          )}
          {speaks && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              {t('onboarding.photo.speaks', { languages: speaks })}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
      />
      <Button
        type="button"
        size="lg"
        onClick={() => inputRef.current?.click()}
        className="w-full gap-2"
      >
        <Camera className="h-5 w-5" />
        {photoUrl
          ? t('onboarding.photo.changePhoto')
          : t('onboarding.photo.uploadPhoto')}
      </Button>
      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

      {/* Guidelines */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">
          {t('onboarding.photo.needsTitle')}
        </h3>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {EXAMPLES.map((img) => (
            <img
              key={img}
              src={`https://i.pravatar.cc/200?img=${img}`}
              alt=""
              aria-hidden
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
        <ul className="mt-5 space-y-3">
          {CHECKLIST.map((key) => (
            <li
              key={key}
              className="flex items-start gap-2.5 text-sm text-gray-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
              {t(`onboarding.photo.checklist.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </StepShell>
  );
}
