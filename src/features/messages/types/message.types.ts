import { type ID, type PaginationParams } from '@/types';

/** The three inbox folders shown as tabs in the messages panel. */
export type MessageFolder = 'all' | 'unread' | 'archived';

/**
 * A single conversation thread between the student and a tutor, as summarized
 * in the inbox list (the row preview, not the full message history).
 */
export interface Conversation {
  id: ID;
  /** Tutor on the other side of the thread. */
  tutorName: string;
  tutorAvatarUrl: string;
  /** Preview of the most recent message. */
  lastMessage: string;
  /** ISO timestamp of the most recent message. */
  lastMessageAt: string;
  /** Whether the thread has messages the student hasn't read. */
  unread: boolean;
  /** Whether the student has archived the thread. */
  archived: boolean;
}

/** Query params for listing conversations. */
export interface ConversationListParams extends PaginationParams {
  folder?: MessageFolder;
}
