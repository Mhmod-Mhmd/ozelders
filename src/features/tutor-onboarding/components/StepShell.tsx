import { type FormEventHandler, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StepShellProps {
  title: string;
  subtitle?: ReactNode;
  /** Form submit handler (e.g. RHF `handleSubmit(onValid)`). */
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** Omit on the first step to hide the Back button. */
  onBack?: () => void;
  isSubmitting?: boolean;
  /** Overrides the default "Save and continue" label (e.g. the last step). */
  submitLabel?: string;
  /** A request-level error to surface above the action buttons. */
  serverError?: string;
  children: ReactNode;
}

/**
 * Shared frame every step renders into: the heading + intro copy, the step's
 * fields, an optional request error, and the Back / Save-and-continue footer.
 * Centralizing it keeps all eight steps visually consistent and accessible (one
 * `<form>`, one submit button, one place to tweak spacing).
 */
export function StepShell({
  title,
  subtitle,
  onSubmit,
  onBack,
  isSubmitting,
  submitLabel,
  serverError,
  children,
}: StepShellProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}

      <div className="mt-8 flex flex-col gap-6">{children}</div>

      {serverError && <p className="mt-6 text-sm text-red-500">{serverError}</p>}

      <div className="mt-10 flex items-center justify-end gap-3">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={isSubmitting}
          >
            {t('onboarding.actions.back')}
          </Button>
        )}
        <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel ?? t('onboarding.actions.saveContinue')}
        </Button>
      </div>
    </form>
  );
}
