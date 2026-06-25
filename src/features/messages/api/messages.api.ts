import { httpClient } from '@/lib/axios';
import { type Paginated } from '@/types';
import {
  type Conversation,
  type ConversationListParams,
} from '../types/message.types';

const RESOURCE = '/conversations';

/** Fetch a paginated list of conversations, optionally filtered by folder. */
export async function getConversations(
  params: ConversationListParams = {},
): Promise<Paginated<Conversation>> {
  const { data } = await httpClient.get<Paginated<Conversation>>(RESOURCE, {
    params,
  });
  return data;
}
