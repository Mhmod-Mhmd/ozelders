import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'brand' | 'success' | 'neutral' | 'warning' | 'amber';

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-green-50 text-green-700',
  neutral: 'bg-gray-100 text-gray-700',
  warning: 'bg-orange-50 text-orange-700',
  amber: 'bg-amber-50 text-amber-700',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
