import { type InputHTMLAttributes, type Ref, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  ref?: Ref<HTMLInputElement>;
  invalid?: boolean;
}

/** Password field with a show/hide toggle, styled like `Input`. */
export function PasswordInput({
  className,
  invalid,
  ...props
}: PasswordInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const reactId = useId();
  const id = props.id ?? reactId;

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid || undefined}
        className={cn(
          'w-full rounded-xl border bg-white py-2.5 ps-3.5 pe-11 text-sm text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50',
          invalid
            ? 'border-red-400 focus-visible:border-red-500'
            : 'border-gray-200 focus-visible:border-brand-400',
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={
          visible ? t('common.hidePassword') : t('common.showPassword')
        }
        aria-pressed={visible}
        className="absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition-colors hover:text-gray-600"
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
