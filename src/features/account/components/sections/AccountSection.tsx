import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/types';
import { useAccount } from '../../hooks/useAccount';
import { AccountSettingsForm } from '../AccountSettingsForm';

/** Loads the account profile and renders the editable form. */
export function AccountSection() {
  const { t } = useTranslation();
  const { data: account, isLoading, isError, error, refetch } = useAccount();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-20 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('common.loading')}
      </div>
    );
  }
  if (isError || !account) {
    return (
      <ErrorState
        message={error instanceof ApiError ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return <AccountSettingsForm account={account} />;
}
