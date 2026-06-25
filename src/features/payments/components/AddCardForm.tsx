import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { ApiError } from '@/types';
import { addCardSchema, type AddCardInput } from '../types/payment.types';
import { useAddCard } from '../hooks/usePayments';

interface AddCardFormProps {
  onDone: () => void;
  onCancel: () => void;
}

/** Inline new-card form with client + server validation. */
export function AddCardForm({ onDone, onCancel }: AddCardFormProps) {
  const { t } = useTranslation();
  const add = useAddCard();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddCardInput>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      holder: '',
      number: '',
      expMonth: '',
      expYear: '',
      cvc: '',
    },
  });

  const errorText = (message?: string) =>
    message
      ? message.startsWith('payments.')
        ? t(message)
        : message
      : undefined;

  async function onSubmit(values: AddCardInput) {
    try {
      await add.mutateAsync(values);
      onDone();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof AddCardInput, { message: messages[0] });
        }
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-4 flex flex-col gap-4 rounded-xl border border-gray-200 p-4"
    >
      <Field
        label={t('payments.cardholder')}
        htmlFor="holder"
        error={errorText(errors.holder?.message)}
      >
        <Input
          id="holder"
          autoComplete="cc-name"
          invalid={Boolean(errors.holder)}
          {...register('holder')}
        />
      </Field>

      <Field
        label={t('payments.cardNumber')}
        htmlFor="number"
        error={errorText(errors.number?.message)}
      >
        <Input
          id="number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          invalid={Boolean(errors.number)}
          {...register('number')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field
          label={t('payments.expMonth')}
          htmlFor="expMonth"
          error={errorText(errors.expMonth?.message)}
        >
          <Input
            id="expMonth"
            inputMode="numeric"
            placeholder="MM"
            invalid={Boolean(errors.expMonth)}
            {...register('expMonth')}
          />
        </Field>
        <Field
          label={t('payments.expYear')}
          htmlFor="expYear"
          error={errorText(errors.expYear?.message)}
        >
          <Input
            id="expYear"
            inputMode="numeric"
            placeholder="YYYY"
            invalid={Boolean(errors.expYear)}
            {...register('expYear')}
          />
        </Field>
        <Field
          label={t('payments.cvc')}
          htmlFor="cvc"
          error={errorText(errors.cvc?.message)}
          className="col-span-2 sm:col-span-1"
        >
          <Input
            id="cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            invalid={Boolean(errors.cvc)}
            {...register('cvc')}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('payments.saveCard')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
}
