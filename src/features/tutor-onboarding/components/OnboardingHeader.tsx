import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, User } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { paths } from '@/router/paths';

/**
 * Slim top bar for the onboarding flow: brand logo on the leading edge, and a
 * language/currency switcher plus help and account shortcuts on the trailing
 * edge. Intentionally separate from the marketing `Navbar` so the wizard reads
 * as a focused, distraction-free task.
 */
export function OnboardingHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="hidden sm:block" />
          <a
            href="#help"
            aria-label={t('onboarding.header.help')}
            title={t('onboarding.header.help')}
            className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <HelpCircle className="h-5 w-5" />
          </a>
          <Link
            to={paths.studentHome}
            aria-label={t('onboarding.header.account')}
            className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
