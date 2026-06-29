import { useTranslation } from 'react-i18next';
import { Bell, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePopover } from '@/hooks';

/**
 * Notifications dropdown shown in the student header. Opens on the bell icon
 * click and closes on an outside click, on Escape, or via the close button.
 * Mirrors the interaction pattern of {@link ProfileMenu}.
 */
export function NotificationMenu() {
  const { t } = useTranslation();
  const { open, setOpen, containerRef, panelId } = usePopover<HTMLDivElement>();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('account.notifications')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100',
          open && 'bg-gray-100 text-brand-600',
        )}
      >
        <Bell className="h-5 w-5" />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t('notifications.title')}
          className="absolute end-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              {t('notifications.title')}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('notifications.close')}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <Bell className="h-10 w-10 text-gray-400" />
            <p className="mt-4 text-base font-bold text-gray-900">
              {t('notifications.emptyTitle')}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {t('notifications.emptyBody')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
