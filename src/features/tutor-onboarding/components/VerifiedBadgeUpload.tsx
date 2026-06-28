import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X } from 'lucide-react';

interface VerifiedBadgeUploadProps {
  title: string;
  description: string;
}

/**
 * The grey "Get … verified" promo box shown under the certificate and education
 * forms. Picking a file is acknowledged locally (filename chip) — the document
 * itself would be sent to a review endpoint in production; here it stays a
 * self-contained, dependency-free affordance.
 */
export function VerifiedBadgeUpload({
  title,
  description,
}: VerifiedBadgeUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputId = useId();

  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <h4 className="text-base font-bold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <p className="mt-3 text-sm text-gray-500">
        {t('onboarding.upload.formatNote')}
      </p>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />

      {fileName ? (
        <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
          <span className="truncate">{fileName}</span>
          <button
            type="button"
            onClick={() => {
              setFileName(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            aria-label={t('onboarding.upload.remove')}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        >
          <Upload className="h-4 w-4" />
          {t('onboarding.upload.button')}
        </button>
      )}
    </div>
  );
}
