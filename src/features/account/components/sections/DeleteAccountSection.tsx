import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/types';
import { useAccount, useDeleteAccount } from '../../hooks/useAccount';

/** Account-deletion panel with email confirmation. */
export function DeleteAccountSection() {
  const { t } = useTranslation();
  const { data: account, isLoading, isError, refetch } = useAccount();
  const del = useDeleteAccount();
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('common.loading')}
      </div>
    );
  }
  if (isError || !account) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (del.isSuccess) {
    return (
      <div className="flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-gray-200 px-6 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <h1 className="text-xl font-bold text-gray-900">
          {t('settings.delete.doneTitle')}
        </h1>
        <p className="text-sm text-gray-600">{t('settings.delete.doneBody')}</p>
      </div>
    );
  }

  const matches =
    email.trim().toLowerCase() === account.email.toLowerCase() &&
    email.trim() !== '';

  async function onDelete() {
    setServerError(null);
    try {
      await del.mutateAsync(email.trim());
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.fieldErrors?.email?.[0] ?? error.message);
      }
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('settings.delete.title')}
      </h1>

      <p className="text-sm text-gray-600">{t('settings.delete.warning')}</p>

      <Field
        label={t('settings.email.label')}
        htmlFor="deleteEmail"
        error={serverError ?? undefined}
      >
        <Input
          id="deleteEmail"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={Boolean(serverError)}
        />
      </Field>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="danger"
          disabled={!matches || del.isPending}
          onClick={onDelete}
          className="w-full gap-2 sm:w-auto"
        >
          {del.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {t('settings.delete.button')}
        </Button>
      </div>
    </div>
  );
}
