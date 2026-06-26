import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthUser, useLogout } from '@/features/auth';
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
  /** Render a divider above this item to group it visually. */
  divider?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'home', to: paths.studentFindTutor },
  { key: 'messages', to: paths.studentMessages },
  { key: 'myLessons', to: paths.studentLessons },
  { key: 'savedTutors', to: paths.studentSaved },
  { key: 'referFriend', to: '#' },
  { key: 'settings', to: paths.studentSettings },
  { key: 'help', to: '#', divider: true },
];

export function ProfileMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : t('account.yourAccount');
  const avatarUrl = user?.avatarUrl ?? 'https://i.pravatar.cc/80?img=47';

  async function handleLogout() {
    setOpen(false);
    await logout.mutateAsync();
    navigate(paths.home, { replace: true });
  }

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
          src={avatarUrl}
          alt={t('account.yourAccount')}
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
            <Avatar src={avatarUrl} alt="" size={40} className="h-10 w-10" />
            <span className="truncate text-base font-bold text-gray-900">
              {displayName}
            </span>
          </div>

          <div className="my-1 border-t border-gray-100" />

          {MENU_ITEMS.map((item) => (
            <div key={item.key}>
              {item.divider && <div className="my-1 border-t border-gray-100" />}
              <Link
                to={item.to ?? '#'}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={itemClass}
              >
                {t(`account.${item.key}`)}
              </Link>
            </div>
          ))}

          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={logout.isPending}
            className={cn(itemClass, 'w-full text-start disabled:opacity-50')}
          >
            {t('account.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
