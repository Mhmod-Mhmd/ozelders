import { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query';
import { CurrencyProvider } from '@/currency';

/**
 * Composes all global context providers in one place. Add new providers
 * (theme, auth, i18n, error boundary, …) here to keep `main.tsx` thin and the
 * provider order explicit.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        {children}
        {import.meta.env.DEV ? (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        ) : null}
      </CurrencyProvider>
    </QueryClientProvider>
  );
}
