import { ApiError } from '@/types';

/**
 * Field-error resolver shared by every step form. Schema and server validation
 * messages are i18n keys under `onboarding.*`, so they're translated; anything
 * else (an unexpected server string) is shown verbatim.
 */
export function makeErrorText(t: (key: string) => string) {
  return (message?: string): string | undefined =>
    message
      ? message.startsWith('onboarding.')
        ? t(message)
        : message
      : undefined;
}

/**
 * A request-level message for the step footer. Field-level 422s are rendered
 * inline next to their inputs, so those return nothing here; only network or
 * unexpected failures surface as a general error.
 */
export function serverErrorMessage(
  error: unknown,
  t: (key: string) => string,
): string | undefined {
  if (error instanceof ApiError) {
    return error.fieldErrors ? undefined : error.message;
  }
  return error ? t('common.error.body') : undefined;
}
