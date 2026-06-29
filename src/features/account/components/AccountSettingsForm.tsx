import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Field } from '@/components/ui/Field';
import { ApiError } from '@/types';
import {
  type Account,
  type UpdateAccountInput,
  accountProfileSchema,
} from '../types/account.types';
import { useUpdateAccount } from '../hooks/useAccount';
import { TIMEZONES, timezoneLabel } from '../utils/timezones';
import { ProfileImageField } from './ProfileImageField';
import { PhoneField } from './PhoneField';
import { SocialNetworks } from './SocialNetworks';

interface AccountSettingsFormProps {
  account: Account;
}

/** The Account settings panel: profile image, identity fields and socials. */
export function AccountSettingsForm({ account }: AccountSettingsFormProps) {
  const { t, i18n } = useTranslation();
  const update = useUpdateAccount();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateAccountInput>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: {
      firstName: account.firstName,
      lastName: account.lastName,
      phoneCountry: account.phoneCountry,
      phoneNumber: account.phoneNumber,
      timezone: account.timezone,
    },
  });

  const phoneCountry = watch('phoneCountry');

  /** Translate a field error: schema messages are i18n keys, server ones aren't. */
  const errorText = (message?: string) => {
    if (!message) return undefined;
    return message.startsWith('settings.') ? t(message) : message;
  };

  async function onSubmit(values: UpdateAccountInput) {
    try {
      await update.mutateAsync(values);
      reset(values); // clear the dirty/success state baseline
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof UpdateAccountInput, {
            message: messages[0],
          });
        }
      }
    }
  }

  const showSuccess = update.isSuccess && !isDirty;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('settings.account.title')}
      </h1>

      <ProfileImageField avatarUrl={account.avatarUrl} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-xl flex-col gap-6"
      >
        <Field
          label={t('settings.account.firstName')}
          htmlFor="firstName"
          required
          requiredText={t('settings.account.required')}
          error={errorText(errors.firstName?.message)}
        >
          <Input
            id="firstName"
            autoComplete="given-name"
            invalid={Boolean(errors.firstName)}
            {...register('firstName')}
          />
        </Field>

        <Field
          label={t('settings.account.lastName')}
          htmlFor="lastName"
          error={errorText(errors.lastName?.message)}
        >
          <Input
            id="lastName"
            autoComplete="family-name"
            invalid={Boolean(errors.lastName)}
            {...register('lastName')}
          />
        </Field>

        <Field
          label={t('settings.account.phone.label')}
          htmlFor="phoneNumber"
          error={errorText(errors.phoneNumber?.message)}
        >
          <PhoneField
            id="phoneNumber"
            country={phoneCountry}
            onCountryChange={(iso) =>
              setValue('phoneCountry', iso, { shouldDirty: true })
            }
            numberField={register('phoneNumber')}
            invalid={Boolean(errors.phoneNumber)}
          />
        </Field>

        <Field
          label={t('settings.account.timezone')}
          htmlFor="timezone"
          error={errorText(errors.timezone?.message)}
        >
          <Select id="timezone" {...register('timezone')}>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {timezoneLabel(tz, i18n.language)}
              </option>
            ))}
          </Select>
        </Field>

        <SocialNetworks socials={account.socials} />

        {update.isError && (
          <p className="text-sm text-red-500">
            {update.error instanceof ApiError
              ? update.error.message
              : t('common.error.body')}
          </p>
        )}

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
          {showSuccess && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" />
              {t('settings.account.saved')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
