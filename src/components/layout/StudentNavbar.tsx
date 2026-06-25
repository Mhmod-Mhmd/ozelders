import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, HelpCircle, Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { MessageMenu } from '@/features/messages';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { ProfileMenu } from './ProfileMenu';
import { NotificationMenu } from './NotificationMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  /** Translation key under `nav.*`. */
  key: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'findTutors', to: paths.studentHome },
  { key: 'corporate', to: '#' },
];

/**
 * Round icon control used for the help / saved actions. Renders a `Link` when
 * `to` is given (navigation), otherwise a plain button (action only).
 */
function IconButton({
  label,
  to,
  onClick,
  children,
}: {
  label: string;
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const className =
    'rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100';

  if (to) {
    return (
      <Link to={to} aria-label={label} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * Header shown to logged-in students (the post-login area). Swaps out the
 * marketing navbar: keeps the logo + primary nav, and adds account actions
 * (refer a friend, language/currency, messages, notifications, avatar).
 */
export function StudentNavbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: logo + primary nav */}
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-semibold text-gray-900 hover:text-brand-600',
                      isActive && item.to !== '#' && 'text-brand-600',
                    )
                  }
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: account actions */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
            >
              {t('nav.referFriend')}
            </button>

            <LanguageSwitcher />

            <div className="flex items-center gap-0.5">
              <MessageMenu />
              <IconButton label={t('account.help')}>
                <HelpCircle className="h-5 w-5" />
              </IconButton>
              <IconButton
                label={t('account.savedTutors')}
                to={paths.studentSaved}
              >
                <Heart className="h-5 w-5" />
              </IconButton>
              <NotificationMenu />
            </div>

            <ProfileMenu />
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
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <LanguageSwitcher />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://i.pravatar.cc/80?img=47"
                  alt={t('account.yourAccount')}
                  size={40}
                  className="h-10 w-10"
                />
                <span className="text-sm font-semibold text-gray-900">
                  {t('account.yourAccount')}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <MessageMenu />
                <IconButton
                  label={t('account.savedTutors')}
                  to={paths.studentSaved}
                  onClick={() => setOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                </IconButton>
                <NotificationMenu />
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
