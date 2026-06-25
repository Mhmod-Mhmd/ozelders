import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Heart,
  HelpCircle,
  Menu,
  MessageSquare,
  X,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';

interface NavItem {
  label: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Find tutors', to: paths.studentHome },
  { label: 'Corporate training', to: '#' },
];

/** Round icon button used for the chat / help / saved / notifications actions. */
function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
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
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-semibold text-gray-900 hover:text-brand-600',
                      isActive && item.to !== '#' && 'text-brand-600',
                    )
                  }
                >
                  {item.label}
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
              Refer a friend
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-600 hover:bg-gray-100"
            >
              English, TRY
              <ChevronDown className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-0.5">
              <IconButton label="Messages">
                <MessageSquare className="h-5 w-5" />
              </IconButton>
              <IconButton label="Help">
                <HelpCircle className="h-5 w-5" />
              </IconButton>
              <IconButton label="Saved tutors">
                <Heart className="h-5 w-5" />
              </IconButton>
              <IconButton label="Notifications">
                <Bell className="h-5 w-5" />
              </IconButton>
            </div>

            <button
              type="button"
              aria-label="Account menu"
              className="ml-1 rounded-full ring-offset-2 transition hover:ring-2 hover:ring-brand-200"
            >
              <Avatar
                src="https://i.pravatar.cc/80?img=47"
                alt="Your account"
                size={36}
                className="h-9 w-9"
              />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
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
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://i.pravatar.cc/80?img=47"
                  alt="Your account"
                  size={40}
                  className="h-10 w-10"
                />
                <span className="text-sm font-semibold text-gray-900">
                  Your account
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IconButton label="Messages">
                  <MessageSquare className="h-5 w-5" />
                </IconButton>
                <IconButton label="Saved tutors">
                  <Heart className="h-5 w-5" />
                </IconButton>
                <IconButton label="Notifications">
                  <Bell className="h-5 w-5" />
                </IconButton>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
