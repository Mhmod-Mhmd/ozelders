import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, HelpCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { buttonVariants } from '@/components/ui/button-variants';
import { useAuthUser, useLogout } from '@/features/auth';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  /** Translation key under `nav.*`. */
  key: string;
  to: string;
  /** Hash/anchor links use a plain <a>; route links use <NavLink>. */
  anchor?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'findTutors', to: paths.studentFindTutor },
  { key: 'subjects', to: '/#subjects', anchor: true },
  { key: 'howItWorks', to: '/#how-it-works', anchor: true },
  { key: 'becomeTutor', to: paths.becomeTutor },
];

function DesktopLink({ item }: { item: NavItem }) {
  const { t } = useTranslation();
  const label = t(`nav.${item.key}`);
  const className = 'text-sm font-medium text-gray-700 hover:text-brand-600';
  if (item.anchor) {
    return (
      <a href={item.to} className={className}>
        {label}
      </a>
    );
  }
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => cn(className, isActive && 'text-brand-600')}
    >
      {label}
    </NavLink>
  );
}

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // The marketing header is also shown to signed-in non-students (e.g. tutors),
  // who have no dedicated area yet — so it offers account/log-out when there's
  // a session, and sign-in/get-started for guests.
  const user = useAuthUser();
  const logout = useLogout();

  async function handleLogout() {
    setOpen(false);
    await logout.mutateAsync();
    navigate(paths.home, { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_ITEMS.map((item) => (
                <DesktopLink key={item.key} item={item} />
              ))}
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher className="hidden lg:block" />
            <button
              type="button"
              aria-label={t('nav.help')}
              className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:block"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            {user ? (
              <>
                <span className="flex items-center gap-2 ps-1 text-sm font-semibold text-gray-900">
                  <Avatar
                    src={user.avatarUrl}
                    alt=""
                    size={32}
                    className="h-8 w-8"
                  />
                  {user.firstName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  {t('account.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to={paths.login}
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to={paths.studentFindTutor}
                  className={buttonVariants({ size: 'sm' })}
                >
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) =>
                item.anchor ? (
                  <a
                    key={item.key}
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ) : (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ),
              )}
            </nav>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <LanguageSwitcher />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="flex items-center gap-2 px-1 text-base font-semibold text-gray-900">
                    <Avatar
                      src={user.avatarUrl}
                      alt=""
                      size={36}
                      className="h-9 w-9"
                    />
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'md',
                    })}
                  >
                    {t('account.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={paths.login}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'md',
                    })}
                  >
                    {t('nav.signIn')}
                  </Link>
                  <Link
                    to={paths.studentFindTutor}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ size: 'md' })}
                  >
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
