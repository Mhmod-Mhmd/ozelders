import { type Conversation } from '@/features/messages/types/message.types';

/**
 * Mock "database" of message threads for the logged-in student. Empty for now —
 * a fresh student has no conversations yet, which drives the empty state in the
 * messages panel. Seed rows here later to exercise the populated list/filters.
 */
export const CONVERSATIONS: Conversation[] = [];
