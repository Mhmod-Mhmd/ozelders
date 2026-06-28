import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  /** Visible label beside the box (string or rich node). */
  label: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Square checkbox + label matching the onboarding design: an empty bordered box
 * that fills dark with a white check when ticked. The real `<input>` is visually
 * hidden but keyboard- and screen-reader-accessible, and accepts native props so
 * it works both controlled (`checked`/`onChange`) and with React Hook Form
 * (`{...register(name)}`).
 */
export function FormCheckbox({ id, label, className, ...props }: FormCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-start gap-2.5 select-none',
        className,
      )}
    >
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-gray-300 bg-white transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 peer-focus-visible:ring-offset-1"
      >
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </span>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </label>
  );
}
