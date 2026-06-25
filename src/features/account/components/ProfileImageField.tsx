import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUploadAvatar } from '../hooks/useAccount';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPTED = ['image/jpeg', 'image/png'];

interface ProfileImageFieldProps {
  avatarUrl: string;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Avatar preview with upload-photo / edit controls and client-side validation. */
export function ProfileImageField({ avatarUrl }: ProfileImageFieldProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const upload = useUploadAvatar();

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError(t('settings.account.avatar.errorType'));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t('settings.account.avatar.errorSize'));
      return;
    }

    setError(null);
    try {
      const dataUrl = await readAsDataUrl(file);
      await upload.mutateAsync(dataUrl);
    } catch {
      setError(t('settings.account.avatar.errorGeneric'));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">
        {t('settings.account.avatar.label')}
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex flex-col items-start gap-2">
          <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={avatarUrl}
              alt={t('settings.account.avatar.label')}
              className="h-full w-full object-cover"
            />
            {upload.isPending && (
              <div className="absolute inset-0 grid place-items-center bg-white/60">
                <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
          >
            {t('settings.account.avatar.edit')}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className="w-fit gap-2"
          >
            <ImageUp className="h-4 w-4" />
            {t('settings.account.avatar.upload')}
          </Button>
          <p className="text-sm text-gray-400">
            {t('settings.account.avatar.maxSize')}
            <br />
            {t('settings.account.avatar.formats')}
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
