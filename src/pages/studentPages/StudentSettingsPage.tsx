import { AccountSettings } from '@/features/account';

/**
 * Student account settings. Composes the account feature; all data access and
 * business logic live in the feature, keeping the page a thin shell.
 */
export function StudentSettingsPage() {
  return <AccountSettings />;
}
