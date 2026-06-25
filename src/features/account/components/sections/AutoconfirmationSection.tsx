import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { type AutoconfirmMode } from '../../types/account.types';
import { useAutoconfirm, useUpdateAutoconfirm } from '../../hooks/useAccount';

const OPTIONS: AutoconfirmMode[] = ['scheduled', 'all'];

/** Lesson auto-confirmation preferences. */
export function AutoconfirmationSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useAutoconfirm();
  const update = useUpdateAutoconfirm();
  const [mode, setMode] = useState<AutoconfirmMode | null>(null);

  useEffect(() => {
    if (data && mode === null) setMode(data.mode);
  }, [data, mode]);

  if (isLoading || mode === null) {
    return (
      <div className="flex items-center gap-3 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('common.loading')}
      </div>
    );
  }
  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const dirty = mode !== data?.mode;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('settings.autoconfirm.title')}
      </h1>

      <p className="text-sm text-gray-600">{t('settings.autoconfirm.intro')}</p>

      <div className="flex flex-col gap-3 text-sm text-gray-700">
        <p>
          <span className="font-semibold">
            {t('settings.autoconfirm.insideTitle')}
          </span>{' '}
          {t('settings.autoconfirm.insideBody')}
        </p>
        <p>
          <span className="font-semibold">
            {t('settings.autoconfirm.outsideTitle')}
          </span>{' '}
          {t('settings.autoconfirm.outsideBody')}
        </p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm text-gray-600">
          {t('settings.autoconfirm.choose')}
        </legend>
        {OPTIONS.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 text-sm text-gray-800"
          >
            <input
              type="radio"
              name="autoconfirm"
              value={option}
              checked={mode === option}
              onChange={() => setMode(option)}
              className="mt-0.5 h-4 w-4 accent-brand-500"
            />
            <span>{t(`settings.autoconfirm.options.${option}`)}</span>
          </label>
        ))}
      </fieldset>

      <p className="text-sm text-gray-400">{t('settings.autoconfirm.help')}</p>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          disabled={!dirty || update.isPending}
          onClick={() => update.mutate(mode)}
          className="w-full gap-2 sm:w-auto"
        >
          {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('settings.account.save')}
        </Button>
        {update.isSuccess && !dirty && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check className="h-4 w-4" />
            {t('settings.account.saved')}
          </span>
        )}
      </div>
    </div>
  );
}
