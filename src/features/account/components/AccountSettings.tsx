import { useState, type ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import {
  PaymentHistorySection,
  PaymentMethodsSection,
} from '@/features/payments';
import { type SettingsSection } from '../utils/sections';
import { SettingsSidebar } from './SettingsSidebar';
import { AccountSection } from './sections/AccountSection';
import { PasswordSection } from './sections/PasswordSection';
import { EmailSection } from './sections/EmailSection';
import { AutoconfirmationSection } from './sections/AutoconfirmationSection';
import { CalendarSection } from './sections/CalendarSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { DeleteAccountSection } from './sections/DeleteAccountSection';

const PANELS: Record<SettingsSection, ReactNode> = {
  account: <AccountSection />,
  password: <PasswordSection />,
  email: <EmailSection />,
  paymentMethods: <PaymentMethodsSection />,
  paymentHistory: <PaymentHistorySection />,
  autoconfirmation: <AutoconfirmationSection />,
  calendar: <CalendarSection />,
  notifications: <NotificationsSection />,
  deleteAccount: <DeleteAccountSection />,
};

/**
 * Student account settings screen: a section rail beside the active panel.
 * Each panel owns its own data fetching, loading and error states.
 */
export function AccountSettings() {
  const [section, setSection] = useState<SettingsSection>('account');

  return (
    <Container className="py-8 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SettingsSidebar active={section} onSelect={setSection} />
        </aside>

        <div className="min-w-0">{PANELS[section]}</div>
      </div>
    </Container>
  );
}
