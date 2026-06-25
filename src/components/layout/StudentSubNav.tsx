import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';

interface SubNavItem {
  /** Translation key under `accountNav.*`. */
  key: string;
  to: string;
  /** `end` matching so `/student` doesn't stay active on nested routes. */
  end?: boolean;
}

const ITEMS: SubNavItem[] = [
  { key: 'home', to: paths.studentHome, end: true },
  { key: 'messages', to: paths.studentMessages },
  { key: 'myLessons', to: paths.studentLessons },
  { key: 'settings', to: paths.studentSettings },
];

/**
 * Secondary navigation for the student account area (messages, lessons,
 * settings). Sits below the main header on these pages and scrolls horizontally
 * on small screens so it never overflows the viewport.
 */
export function StudentSubNav() {
  const { t } = useTranslation();

  const linkClass = (isActive: boolean) =>
    cn(
      'relative whitespace-nowrap py-4 text-sm font-semibold transition-colors',
      isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900',
    );

  return (
    <div className="border-b border-gray-100 bg-white">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <nav className="-mb-px flex items-center gap-6 overflow-x-auto">
            {ITEMS.map((item) => (
              <NavLink key={item.key} to={item.to} end={item.end}>
                {({ isActive }) => (
                  <span className={linkClass(isActive)}>
                    {t(`accountNav.${item.key}`)}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-500" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="hidden whitespace-nowrap py-4 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900 sm:block"
          >
            {t('accountNav.forBusiness')}
          </button>
        </div>
      </Container>
    </div>
  );
}
