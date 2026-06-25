import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Lock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/types';
import { type CardBrand } from '../types/payment.types';
import { useCards, useRemoveCard } from '../hooks/usePayments';
import { CardBrandIcon } from './CardBrandIcon';
import { AddCardForm } from './AddCardForm';

const BRANDS: CardBrand[] = ['visa', 'mastercard', 'amex', 'discover'];

/** Payment methods: saved cards plus an inline add-card flow. */
export function PaymentMethodsSection() {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);
  const { data, isLoading, isError, error, refetch } = useCards();
  const remove = useRemoveCard();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('settings.sections.paymentMethods')}
      </h1>

      {isLoading ? (
        <div className="flex items-center gap-3 py-10 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t('common.loading')}
        </div>
      ) : isError ? (
        <ErrorState
          message={error instanceof ApiError ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-3">
                <h2 className="text-base font-bold text-gray-900">
                  {t('payments.creditOrDebit')}
                </h2>
                <div className="flex items-center gap-2">
                  {BRANDS.map((brand) => (
                    <CardBrandIcon key={brand} brand={brand} />
                  ))}
                </div>
              </div>
              {!adding && (
                <Button type="button" onClick={() => setAdding(true)}>
                  {t('payments.addCard')}
                </Button>
              )}
            </div>

            {adding && (
              <AddCardForm
                onDone={() => setAdding(false)}
                onCancel={() => setAdding(false)}
              />
            )}
          </div>

          {data && data.data.length > 0 && (
            <ul className="flex flex-col gap-3">
              {data.data.map((card) => (
                <li
                  key={card.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 px-4 py-3"
                >
                  <CardBrandIcon brand={card.brand} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      •••• {card.last4}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('payments.expires', {
                        month: String(card.expMonth).padStart(2, '0'),
                        year: card.expYear,
                      })}{' '}
                      · {card.holder}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove.mutate(card.id)}
                    disabled={remove.isPending}
                    aria-label={t('payments.removeCard')}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4 shrink-0" />
            {t('payments.encryptionNote')}
          </p>
        </>
      )}
    </div>
  );
}
