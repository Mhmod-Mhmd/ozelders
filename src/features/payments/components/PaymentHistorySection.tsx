import { useTranslation } from 'react-i18next';
import { Download, Loader2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/types';
import { type PaymentTransaction } from '../types/payment.types';
import { usePaymentHistory } from '../hooks/usePayments';

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

function formatAmount(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/** Build a CSV blob from the transactions and trigger a download. */
function downloadCsv(
  rows: PaymentTransaction[],
  header: string[],
  filename: string,
): void {
  const lines = rows.map((r) =>
    [r.date, r.subject, r.tutorName, r.hours, r.amount, r.currency].join(','),
  );
  const csv = [header.join(','), ...lines].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Payment history table with CSV export and billing-info action. */
export function PaymentHistorySection() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, error, refetch } = usePaymentHistory();
  const rows = data?.data ?? [];
  const locale = i18n.language;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {t('settings.sections.paymentHistory')}
        </h1>
        <Button type="button" variant="outline">
          {t('payments.updateBilling')}
        </Button>
      </div>

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
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
          <Receipt className="h-10 w-10 text-gray-300" />
          <p className="mt-4 text-gray-500">{t('payments.historyEmpty')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-start text-xs font-semibold tracking-wide text-gray-500 uppercase">
                <th className="py-3 pe-4 text-start font-semibold">
                  {t('payments.table.date')}
                </th>
                <th className="py-3 pe-4 text-start font-semibold">
                  {t('payments.table.subject')}
                </th>
                <th className="py-3 pe-4 text-start font-semibold">
                  {t('payments.table.tutor')}
                </th>
                <th className="py-3 pe-4 text-start font-semibold">
                  {t('payments.table.hours')}
                </th>
                <th className="py-3 pe-4 text-start font-semibold">
                  {t('payments.table.amount')}
                </th>
                <th className="py-3 text-end font-semibold">
                  <button
                    type="button"
                    onClick={() =>
                      downloadCsv(
                        rows,
                        [
                          t('payments.table.date'),
                          t('payments.table.subject'),
                          t('payments.table.tutor'),
                          t('payments.table.hours'),
                          t('payments.table.amount'),
                          t('payments.table.currency'),
                        ],
                        t('payments.historyFilename'),
                      )
                    }
                    className="inline-flex items-center gap-1.5 font-semibold text-gray-700 underline underline-offset-2 hover:text-brand-600"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t('payments.downloadAll')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 text-gray-700"
                >
                  <td className="py-3 pe-4 whitespace-nowrap">
                    {formatDate(row.date, locale)}
                  </td>
                  <td className="py-3 pe-4">{row.subject}</td>
                  <td className="py-3 pe-4">{row.tutorName}</td>
                  <td className="py-3 pe-4">{row.hours}</td>
                  <td
                    className="py-3 pe-4 font-medium text-gray-900"
                    colSpan={2}
                  >
                    {formatAmount(row.amount, row.currency, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
