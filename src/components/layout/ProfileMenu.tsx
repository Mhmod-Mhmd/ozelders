import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';

/**
 * Account dropdown shown in the student header. Opens on avatar click and
 * closes on an outside click, on Escape, or after a menu item is chosen.
 */

interface MenuItem {
  /** Translation key under `account.*`. */
  key: string;
  /** Navigation target. Omit for action-only items (e.g. log out). */
  to?: string;
  /** Action handler for non-navigation items. */
  onSelect?: () => void;
  /** Render a divider above this item to group it visually. */
  divider?: boolean;
}

const ACCOUNT = {
  name: 'Mhmoud M.',
  avatarUrl: 'https://i.pravatar.cc/80?img=47',
} as const;

const MENU_ITEMS: MenuItem[] = [
  { key: 'home', to: paths.studentFindTutor },
  { key: 'messages', to: paths.studentMessages },
  { key: 'myLessons', to: paths.studentLessons },
  { key: 'savedTutors', to: paths.studentSaved },
  { key: 'referFriend', to: '#' },
  { key: 'settings', to: paths.studentSettings },
  { key: 'help', to: '#', divider: true },
  // TODO: clear the session token and redirect once auth is wired up.
  { key: 'logout', onSelect: () => {}, divider: true },
];

export function ProfileMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click or Escape while the menu is open.
  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const itemClass =
    'block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 hover:text-brand-600';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('account.menu')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          'ml-1 rounded-full ring-offset-2 transition hover:ring-2 hover:ring-brand-200',
          open && 'ring-2 ring-brand-300',
        )}
      >
        <Avatar
          src={ACCOUNT.avatarUrl}
          alt="Your account"
          size={36}
          className="h-9 w-9"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('account.title')}
          className="absolute end-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar
              src={ACCOUNT.avatarUrl}
              alt=""
              size={40}
              className="h-10 w-10"
            />
            <span className="truncate text-base font-bold text-gray-900">
              {ACCOUNT.name}
            </span>
          </div>

          <div className="my-1 border-t border-gray-100" />

          {MENU_ITEMS.map((item) => (
            <div key={item.key}>
              {item.divider && <div className="my-1 border-t border-gray-100" />}
              {item.to ? (
                <Link
                  to={item.to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  {t(`account.${item.key}`)}
                </Link>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onSelect?.();
                    setOpen(false);
                  }}
                  className={cn(itemClass, 'w-full text-start')}
                >
                  {t(`account.${item.key}`)}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
