import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { useConversations } from '../hooks/useConversations';
import {
  type Conversation,
  type MessageFolder,
} from '../types/message.types';

const FOLDERS: MessageFolder[] = ['all', 'unread', 'archived'];

/** Tab strip for switching between inbox folders. */
function FolderTabs({
  active,
  onChange,
}: {
  active: MessageFolder;
  onChange: (folder: MessageFolder) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      role="tablist"
      aria-label={t('messages.title')}
      className="flex items-center gap-6 border-b border-gray-100 px-5"
    >
      {FOLDERS.map((folder) => {
        const selected = folder === active;
        return (
          <button
            key={folder}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(folder)}
            className={cn(
              'relative -mb-px py-3 text-sm font-semibold transition-colors',
              selected ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800',
            )}
          >
            {t(`messages.tabs.${folder}`)}
            {selected && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Empty inbox prompt nudging the student to book their first lesson. */
function EmptyInbox() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <h3 className="text-lg font-bold text-gray-900">
        {t('messages.emptyTitle')}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        {t('messages.emptyBody')}
      </p>
      <Link
        to={paths.studentHome}
        className={buttonVariants({ size: 'md', className: 'mt-5' })}
      >
        {t('messages.findTutor')}
      </Link>
    </div>
  );
}

/** A single conversation row in the inbox list. */
function ConversationRow({ conversation }: { conversation: Conversation }) {
  const { i18n } = useTranslation();
  const time = new Intl.DateTimeFormat(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(conversation.lastMessageAt));

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-5 py-3 text-start transition-colors hover:bg-gray-50"
    >
      <Avatar
        src={conversation.tutorAvatarUrl}
        alt={conversation.tutorName}
        size={44}
        className="h-11 w-11 shrink-0"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-gray-900">
            {conversation.tutorName}
          </span>
          <span className="shrink-0 text-xs text-gray-400">{time}</span>
        </span>
        <span className="mt-0.5 flex items-center gap-2">
          <span
            className={cn(
              'truncate text-sm',
              conversation.unread
                ? 'font-semibold text-gray-900'
                : 'text-gray-500',
            )}
          >
            {conversation.lastMessage}
          </span>
          {conversation.unread && (
            <span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-brand-500" />
          )}
        </span>
      </span>
    </button>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Skeleton className="h-11 w-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

/**
 * Inbox panel: folder tabs plus the conversation list, with loading, error and
 * empty states. Shared by the header dropdown and the full messages page, so it
 * stays layout-agnostic — the parent controls width and height.
 */
export function MessagesPanel({ className }: { className?: string }) {
  const [folder, setFolder] = useState<MessageFolder>('all');
  const query = useConversations({ folder });
  const conversations = query.data?.data ?? [];

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <FolderTabs active={folder} onChange={setFolder} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {query.isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : query.isError ? (
          <div className="p-4">
            <ErrorState
              onRetry={() => query.refetch()}
              className="border-0 py-10"
            />
          </div>
        ) : conversations.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {conversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </div>
        ) : (
          <EmptyInbox />
        )}
      </div>
    </div>
  );
}
