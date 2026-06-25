import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Maximize2, MessageSquare, X } from 'lucide-react';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { MessagesPanel } from './MessagesPanel';

/**
 * Messages dropdown shown in the student header. Opens on the chat icon click
 * and closes on an outside click, on Escape, or via the close button. The
 * expand button routes to the full messages page. Mirrors the interaction
 * pattern of {@link NotificationMenu}.
 */
export function MessageMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on outside click or Escape while the panel is open.
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

  function openFullPage() {
    setOpen(false);
    navigate(paths.studentMessages);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('account.messages')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100',
          open && 'bg-gray-100 text-brand-600',
        )}
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t('messages.title')}
          className="absolute end-0 top-full z-50 mt-2 flex h-[28rem] max-h-[calc(100vh-5rem)] w-[calc(100vw-2rem)] max-w-md flex-col rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              {t('messages.title')}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={openFullPage}
                aria-label={t('messages.expand')}
                className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('messages.close')}
                className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <MessagesPanel className="flex-1" />
        </div>
      )}
    </div>
  );
}
