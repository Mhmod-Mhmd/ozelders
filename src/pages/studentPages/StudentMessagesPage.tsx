import { MessagesPanel, ConversationView } from '@/features/messages';

/**
 * Full messages page (reached from the header dropdown's expand button). A
 * two-pane inbox: the conversation list on the start side and the active thread
 * on the end side. On mobile only the list shows; the thread pane appears at
 * `lg` once there's room for both.
 */
export function StudentMessagesPage() {
  return (
    <div className="grid min-h-[28rem] grid-cols-1 bg-white lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[360px_1fr]">
      <div className="min-h-0 border-gray-100 lg:border-e">
        <MessagesPanel className="h-full" />
      </div>
      <div className="hidden min-h-0 lg:block">
        <ConversationView />
      </div>
    </div>
  );
}
