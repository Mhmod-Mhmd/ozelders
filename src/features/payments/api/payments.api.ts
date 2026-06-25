import { httpClient } from '@/lib/axios';
import { type Paginated } from '@/types';
import {
  type AddCardInput,
  type PaymentCard,
  type PaymentTransaction,
} from '../types/payment.types';

/** Fetch the student's saved cards. */
export async function getCards(): Promise<Paginated<PaymentCard>> {
  const { data } =
    await httpClient.get<Paginated<PaymentCard>>('/payment-methods');
  return data;
}

/** Add a card; only its masked details are returned. */
export async function addCard(input: AddCardInput): Promise<PaymentCard> {
  // `cvc` is intentionally never persisted server-side; send it but the mock
  // (like a real PSP) discards it after validation.
  const { data } = await httpClient.post<PaymentCard>(
    '/payment-methods',
    input,
  );
  return data;
}

/** Remove a saved card. */
export async function removeCard(id: string): Promise<{ success: boolean }> {
  const { data } = await httpClient.delete<{ success: boolean }>(
    `/payment-methods/${id}`,
  );
  return data;
}

/** Fetch a page of payment history, newest first. */
export async function getPaymentHistory(
  params: { page?: number; pageSize?: number } = {},
): Promise<Paginated<PaymentTransaction>> {
  const { data } = await httpClient.get<Paginated<PaymentTransaction>>(
    '/payment-history',
    { params },
  );
  return data;
}
