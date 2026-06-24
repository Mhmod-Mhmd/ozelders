import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe, HelpCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';

interface NavItem {
  label: string;
  to: string;
  /** Hash/anchor links use a plain <a>; route links use <NavLink>. */
  anchor?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Find tutors', to: paths.tutors },
  { label: 'Subjects', to: '/#subjects', anchor: true },
  { label: 'How it works', to: '/#how-it-works', anchor: true },
  { label: 'Become a tutor', to: '/#become-tutor', anchor: true },
];

function DesktopLink({ item }: { item: NavItem }) {
  const className = 'text-sm font-medium text-gray-700 hover:text-brand-600';
  if (item.anchor) {
    return (
      <a href={item.to} className={className}>
        {item.label}
      </a>
    );
  }
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => cn(className, isActive && 'text-brand-600')}
    >
      {item.label}
    </NavLink>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_ITEMS.map((item) => (
                <DesktopLink key={item.label} item={item} />
              ))}
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 lg:flex"
            >
              <Globe className="h-4 w-4" />
              EN
            </button>
            <button
              type="button"
              aria-label="Help"
              className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:block"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <a
              href="#"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Sign In
            </a>
            <Link to={paths.tutors} className={buttonVariants({ size: 'sm' })}>
              Get Started
            </Link>
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
              {NAV_ITEMS.map((item) =>
                item.anchor ? (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="#"
                className={buttonVariants({ variant: 'outline', size: 'md' })}
              >
                Sign In
              </a>
              <Link
                to={paths.tutors}
                onClick={() => setOpen(false)}
                className={buttonVariants({ size: 'md' })}
              >
                Get Started
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
