import { useTranslation } from 'react-i18next';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  /** Optional override; falls back to a translated generic message. */
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Generic "something went wrong" panel with an optional retry action. */
export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className={
        'rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center ' +
        (className ?? '')
      }
    >
      <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
      <h3 className="mt-4 text-lg font-bold text-gray-900">
        {t('common.error.title')}
      </h3>
      <p className="mt-1 text-gray-500">{message ?? t('common.error.body')}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-5">
          <RotateCcw className="h-4 w-4" />
          {t('common.error.retry')}
        </Button>
      )}
    </div>
  );
}
