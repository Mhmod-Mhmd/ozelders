import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Field } from '@/components/ui/Field';
import { ApiError } from '@/types';
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '../../types/account.types';
import { useChangePassword } from '../../hooks/useAccount';

/** Change-password panel. */
export function PasswordSection() {
  const { t } = useTranslation();
  const change = useChangePassword();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const errorText = (message?: string) =>
    message
      ? message.startsWith('settings.')
        ? t(message)
        : message
      : undefined;

  async function onSubmit(values: ChangePasswordInput) {
    try {
      await change.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof ChangePasswordInput, {
            message: messages[0],
          });
        }
      }
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('settings.password.title')}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <Field
          label={t('settings.password.current')}
          htmlFor="currentPassword"
          error={errorText(errors.currentPassword?.message)}
        >
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            invalid={Boolean(errors.currentPassword)}
            {...register('currentPassword')}
          />
        </Field>

        <a
          href="#"
          className="-mt-2 w-fit text-sm font-bold text-gray-900 underline underline-offset-2 hover:text-brand-600"
        >
          {t('settings.password.forgot')}
        </a>

        <Field
          label={t('settings.password.new')}
          htmlFor="newPassword"
          error={errorText(errors.newPassword?.message)}
          hint={t('settings.password.hint')}
        >
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            invalid={Boolean(errors.newPassword)}
            {...register('newPassword')}
          />
        </Field>

        <Field
          label={t('settings.password.verify')}
          htmlFor="confirmPassword"
          error={errorText(errors.confirmPassword?.message)}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full gap-2 sm:w-auto"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('settings.account.save')}
          </Button>
          {change.isSuccess && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" />
              {t('settings.password.saved')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
