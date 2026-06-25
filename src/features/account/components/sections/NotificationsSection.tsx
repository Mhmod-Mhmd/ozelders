import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { ErrorState } from '@/components/ui/ErrorState';
import { QrPlaceholder } from '@/components/ui/QrPlaceholder';
import { type NotificationPrefs } from '../../types/account.types';
import {
  useNotificationSettings,
  useUpdateNotificationPrefs,
} from '../../hooks/useAccount';

/** Notification preferences: device push status + email opt-ins. */
export function NotificationsSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useNotificationSettings();
  const update = useUpdateNotificationPrefs();
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);

  useEffect(() => {
    if (data && prefs === null) setPrefs(data.prefs);
  }, [data, prefs]);

  if (isLoading || prefs === null) {
    return (
      <div className="flex items-center gap-3 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('common.loading')}
      </div>
    );
  }
  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const dirty =
    prefs.tips !== data.prefs.tips || prefs.surveys !== data.prefs.surveys;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {t('settings.notifications.title')}
        </h1>
        <p className="text-sm text-gray-600">
          {t('settings.notifications.subtitle')}
        </p>
      </div>

      {/* Mobile push */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Bell className="h-5 w-5" />
          {t('settings.notifications.push.title')}
        </h2>
        {!data.pushEnabled && (
          <p className="text-sm text-gray-600">
            {t('settings.notifications.push.disabled')}
          </p>
        )}
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 px-6 py-8 text-center">
          <p className="text-sm text-gray-600">
            {t('settings.notifications.push.scan')}
          </p>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <QrPlaceholder size={168} />
          </div>
        </div>
      </section>

      {/* Email */}
      <section className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Mail className="h-5 w-5" />
          {t('settings.notifications.email.title')}
        </h2>
        <p className="mb-2 text-sm text-gray-600">
          {t('settings.notifications.email.subtitle')}
        </p>

        <div className="flex items-start justify-between gap-4 border-t border-gray-100 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {t('settings.notifications.email.transactional.title')}
            </p>
            <p className="text-sm text-gray-500">
              {t('settings.notifications.email.transactional.body')}
            </p>
          </div>
          <Badge variant="success" className="shrink-0">
            {t('settings.notifications.email.alwaysActive')}
          </Badge>
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-gray-100 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {t('settings.notifications.email.tips.title')}
            </p>
            <p className="text-sm text-gray-500">
              {t('settings.notifications.email.tips.body')}
            </p>
          </div>
          <Toggle
            checked={prefs.tips}
            onChange={(v) => setPrefs({ ...prefs, tips: v })}
            label={t('settings.notifications.email.tips.title')}
          />
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-gray-100 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {t('settings.notifications.email.surveys.title')}
            </p>
            <p className="text-sm text-gray-500">
              {t('settings.notifications.email.surveys.body')}
            </p>
          </div>
          <Toggle
            checked={prefs.surveys}
            onChange={(v) => setPrefs({ ...prefs, surveys: v })}
            label={t('settings.notifications.email.surveys.title')}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          disabled={!dirty || update.isPending}
          onClick={() => update.mutate(prefs)}
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
