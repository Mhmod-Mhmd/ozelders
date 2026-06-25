import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';

/**
 * Right-hand pane of the messages page shown when no thread is selected. Once a
 * conversation is opened, this is where the message history will render.
 */
export function ConversationView() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <MessageSquare className="h-10 w-10 text-gray-300" />
      <p className="mt-4 text-base font-semibold text-gray-700">
        {t('messages.selectConversation')}
      </p>
    </div>
  );
}
