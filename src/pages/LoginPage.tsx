import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { LoginForm, useSession } from '@/features/auth';
import { paths } from '@/router/paths';

/** A single demo credential row on the sign-in card. */
function DemoCredential({ role, email }: { role: string; email: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-semibold text-gray-700">{role}</span>
      <code className="truncate text-gray-500">{email}</code>
    </div>
  );
}

/**
 * Standalone sign-in screen (no marketing chrome). Centered card with the
 * email/password form, demo credentials, and a language switcher so guests can
 * pick a locale (and direction) before signing in. Already-authenticated users
 * are bounced to the home page.
 */
export function LoginPage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useSession();

  if (!isLoading && user) {
    return <Navigate to={paths.home} replace />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="flex items-center justify-between px-4 py-5 sm:px-8">
        <Logo />
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {t('auth.login.title')}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth.login.subtitle')}
            </p>

            <div className="mt-6">
              <LoginForm />
            </div>

            {/* Demo credentials — this is a mock backend. */}
            <div className="mt-6 space-y-2 rounded-2xl bg-gray-50 p-4 text-xs">
              <p className="font-bold text-gray-900">
                {t('auth.login.demoTitle')}
              </p>
              <DemoCredential
                role={t('auth.login.demoStudent')}
                email="student@ozelders.com"
              />
              <DemoCredential
                role={t('auth.login.demoTutor')}
                email="tutor@ozelders.com"
              />
              <p className="pt-1 text-gray-500">
                {t('auth.login.demoPassword', { password: 'password123' })}
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              to={paths.home}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {t('auth.login.backHome')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
