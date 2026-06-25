import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCard,
  getCards,
  getPaymentHistory,
  removeCard,
} from '../api/payments.api';
import { type AddCardInput } from '../types/payment.types';

/** Query-key factory for the payments feature. */
export const paymentKeys = {
  all: ['payments'] as const,
  cards: () => [...paymentKeys.all, 'cards'] as const,
  history: (page: number) => [...paymentKeys.all, 'history', page] as const,
};

/** The student's saved cards. */
export function useCards() {
  return useQuery({
    queryKey: paymentKeys.cards(),
    queryFn: getCards,
  });
}

/** Add a new card and refresh the list. */
export function useAddCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCardInput) => addCard(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.cards() });
    },
  });
}

/** Remove a saved card and refresh the list. */
export function useRemoveCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.cards() });
    },
  });
}

/** A page of payment history. */
export function usePaymentHistory(page = 1) {
  return useQuery({
    queryKey: paymentKeys.history(page),
    queryFn: () => getPaymentHistory({ page, pageSize: 10 }),
  });
}
