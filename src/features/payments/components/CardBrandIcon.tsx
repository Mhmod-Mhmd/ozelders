import { CreditCard } from 'lucide-react';
import { cn } from '@/utils/cn';
import { type CardBrand } from '../types/payment.types';

interface CardBrandIconProps {
  brand: CardBrand;
  className?: string;
}

/** Brand styling for the small card chips. */
const BRAND: Record<
  Exclude<CardBrand, 'unknown'>,
  { label: string; className: string }
> = {
  visa: { label: 'VISA', className: 'text-[#1434CB]' },
  mastercard: { label: 'mastercard', className: 'text-[#EB001B]' },
  amex: { label: 'AMEX', className: 'text-[#1F72CD]' },
  discover: { label: 'DISCOVER', className: 'text-[#E26310]' },
};

/**
 * Compact card-network mark. Uses a styled wordmark rather than a trademarked
 * logo asset, which keeps the bundle dependency-free.
 */
export function CardBrandIcon({ brand, className }: CardBrandIconProps) {
  if (brand === 'unknown') {
    return (
      <span
        className={cn(
          'inline-flex h-8 w-12 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400',
          className,
        )}
      >
        <CreditCard className="h-4 w-4" />
      </span>
    );
  }

  const { label, className: brandClass } = BRAND[brand];
  return (
    <span
      className={cn(
        'inline-flex h-8 w-12 items-center justify-center rounded-md border border-gray-200 bg-white px-1 text-[9px] font-extrabold tracking-tight',
        brandClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
