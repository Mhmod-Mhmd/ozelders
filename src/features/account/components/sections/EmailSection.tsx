import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/types';
import {
  updateEmailSchema,
  type UpdateEmailInput,
} from '../../types/account.types';
import { useAccount, useUpdateEmail } from '../../hooks/useAccount';

/** Email-address panel. */
export function EmailSection() {
  const { t } = useTranslation();
  const { data: account, isLoading, isError, refetch } = useAccount();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('common.loading')}
      </div>
    );
  }
  if (isError || !account) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return <EmailForm key={account.email} email={account.email} />;
}

function EmailForm({ email }: { email: string }) {
  const { t } = useTranslation();
  const update = useUpdateEmail();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateEmailInput>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email },
  });

  const errorText = (message?: string) =>
    message
      ? message.startsWith('settings.')
        ? t(message)
        : message
      : undefined;

  async function onSubmit(values: UpdateEmailInput) {
    try {
      await update.mutateAsync(values.email);
      reset(values);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors?.email) {
        setError('email', { message: error.fieldErrors.email[0] });
      }
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('settings.sections.email')}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <Field
          label={t('settings.email.label')}
          htmlFor="email"
          error={errorText(errors.email?.message)}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !isDirty}
            className="w-full gap-2 sm:w-auto"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('settings.account.save')}
          </Button>
          {update.isSuccess && !isDirty && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" />
              {t('settings.email.saved')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
