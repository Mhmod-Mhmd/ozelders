import { z } from 'zod';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

/** A saved card as returned by `GET /payment-methods` (no sensitive data). */
export interface PaymentCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
}

/** A row in the student's payment history. */
export interface PaymentTransaction {
  id: string;
  date: string;
  subject: string;
  tutorName: string;
  hours: number;
  amount: number;
  currency: string;
}

const currentYear = 2026; // app "today" — keeps validation deterministic.

/**
 * Add-card form schema, shared with `POST /payment-methods`. Fields stay as
 * strings (text inputs) and are coerced server-side; card data never leaves the
 * client beyond the masked details the server keeps.
 */
export const addCardSchema = z.object({
  holder: z.string().trim().min(1, 'payments.errors.holderRequired'),
  number: z
    .string()
    .refine(
      (v) => /^[0-9]{13,19}$/.test(v.replace(/\s/g, '')),
      'payments.errors.numberInvalid',
    ),
  expMonth: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/, 'payments.errors.monthInvalid'),
  expYear: z
    .string()
    .regex(/^\d{4}$/, 'payments.errors.yearInvalid')
    .refine(
      (v) => Number(v) >= currentYear && Number(v) <= currentYear + 20,
      'payments.errors.yearInvalid',
    ),
  cvc: z
    .string()
    .trim()
    .regex(/^[0-9]{3,4}$/, 'payments.errors.cvcInvalid'),
});

export type AddCardInput = z.infer<typeof addCardSchema>;
