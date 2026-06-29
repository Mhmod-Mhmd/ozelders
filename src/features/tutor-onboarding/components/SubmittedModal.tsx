import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SubmittedModalProps {
  /** Dismiss the dialog (used by the backdrop, the ✕, Esc and the OK button). */
  onClose: () => void;
}

/**
 * "Successfully submitted" confirmation shown over the wizard once the tutor
 * completes registration. A lightweight, dependency-free dialog: backdrop +
 * Escape close, focus moved to the primary action, and a labelled role=dialog.
 */
export function SubmittedModal({ onClose }: SubmittedModalProps) {
  const { t } = useTranslation();
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    okRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submitted-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('onboarding.submitted.close')}
          className="absolute end-4 top-4 text-gray-400 transition-colors hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="submitted-title"
          className="text-xl font-extrabold tracking-tight text-gray-900"
        >
          {t('onboarding.submitted.title')}
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          {t('onboarding.submitted.body')}
        </p>

        <div className="mt-6 flex justify-end">
          <Button ref={okRef} type="button" size="lg" onClick={onClose}>
            {t('onboarding.submitted.okay')}
          </Button>
        </div>
      </div>
    </div>
  );
}
