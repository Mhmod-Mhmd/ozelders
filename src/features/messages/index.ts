/**
 * Public surface of the `messages` feature. Import from `@/features/messages`
 * rather than reaching into individual files.
 */
export { getConversations } from './api/messages.api';
export { useConversations, messageKeys } from './hooks/useConversations';
export { MessageMenu } from './components/MessageMenu';
export { MessagesPanel } from './components/MessagesPanel';
export { ConversationView } from './components/ConversationView';
export type {
  Conversation,
  ConversationListParams,
  MessageFolder,
} from './types/message.types';
