/**
 * The signed-in student's saved cards and payment history. In a real backend
 * these would be rows owned by the authenticated user (and cards would live in
 * a PCI-compliant vault). Here they're mutable in-memory collections the mock
 * API reads and writes; only the mock backend should touch these helpers.
 */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface PaymentCard {
  id: string;
  brand: CardBrand;
  /** Last four digits — the only part of the PAN we ever keep. */
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
}

export interface PaymentTransaction {
  id: string;
  /** ISO date string. */
  date: string;
  subject: string;
  tutorName: string;
  hours: number;
  amount: number;
  currency: string;
}

let cards: PaymentCard[] = [];
let cardSeq = 0;

const history: PaymentTransaction[] = [
  {
    id: 'pt_1003',
    date: '2026-06-12',
    subject: 'English',
    tutorName: 'Sophie Martin',
    hours: 1,
    amount: 24,
    currency: 'USD',
  },
  {
    id: 'pt_1002',
    date: '2026-05-28',
    subject: 'Business English',
    tutorName: 'Daniel Reed',
    hours: 2,
    amount: 48,
    currency: 'USD',
  },
  {
    id: 'pt_1001',
    date: '2026-05-14',
    subject: 'IELTS',
    tutorName: 'Aiko Tanaka',
    hours: 1,
    amount: 30,
    currency: 'USD',
  },
];

/** Detect the card brand from the leading digits of a PAN. */
export function detectBrand(pan: string): CardBrand {
  const digits = pan.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  return 'unknown';
}

/** All saved cards. */
export function getCards(): PaymentCard[] {
  return cards;
}

/** Add a card, keeping only its safe (non-sensitive) details. */
export function addCard(input: {
  number: string;
  expMonth: number;
  expYear: number;
  holder: string;
}): PaymentCard {
  const digits = input.number.replace(/\D/g, '');
  cardSeq += 1;
  const card: PaymentCard = {
    id: `card_${cardSeq}`,
    brand: detectBrand(digits),
    last4: digits.slice(-4),
    expMonth: input.expMonth,
    expYear: input.expYear,
    holder: input.holder,
  };
  cards = [...cards, card];
  return card;
}

/** Remove a saved card by id. Returns whether a card was removed. */
export function removeCard(id: string): boolean {
  const next = cards.filter((c) => c.id !== id);
  const removed = next.length !== cards.length;
  cards = next;
  return removed;
}

/** Full payment history, newest first. */
export function getPaymentHistory(): PaymentTransaction[] {
  return [...history].sort((a, b) => b.date.localeCompare(a.date));
}
