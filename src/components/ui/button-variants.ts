import { cn } from '@/utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'white'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'transition-colors disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  outline: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  white: 'bg-white text-brand-700 shadow-sm hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Build the className for a button-styled element. Use with `<Button>` or to
 * style a `<Link>` as a button: `<Link className={buttonVariants()}>`.
 */
export function buttonVariants(opts?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  const { variant = 'primary', size = 'md', className } = opts ?? {};
  return cn(base, variants[variant], sizes[size], className);
}
