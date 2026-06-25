import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../api/messages.api';
import { type ConversationListParams } from '../types/message.types';

/**
 * Query-key factory for the messages feature. Colocated with the hooks so cache
 * invalidation stays predictable, e.g.
 * `queryClient.invalidateQueries({ queryKey: messageKeys.lists() })`.
 */
export const messageKeys = {
  all: ['conversations'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (params: ConversationListParams) =>
    [...messageKeys.lists(), params] as const,
};

/** List conversations with an optional folder filter and pagination. */
export function useConversations(params: ConversationListParams = {}) {
  return useQuery({
    queryKey: messageKeys.list(params),
    queryFn: () => getConversations(params),
  });
}
