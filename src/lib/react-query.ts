import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api';

/**
 * App-wide React Query client with sensible production defaults.
 *
 * - `staleTime` of 1 min avoids refetch storms on remounts/navigation.
 * - Window-focus refetch is disabled (enable per-query where it matters).
 * - 4xx responses are treated as terminal and are not retried; transient/5xx
 *   failures are retried twice with React Query's exponential backoff.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
