import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingStarsProps {
  value: number;
  reviewsCount?: number;
  /** 'compact' shows one star + number; 'stars' shows a 5-star row. */
  variant?: 'compact' | 'stars';
  size?: 'sm' | 'md';
  className?: string;
}

export function RatingStars({
  value,
  reviewsCount,
  variant = 'compact',
  size = 'sm',
  className,
}: RatingStarsProps) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  if (variant === 'stars') {
    const rounded = Math.round(value);
    return (
      <div className={cn('flex items-center gap-0.5', className)}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < rounded
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200',
            )}
          />
        ))}
        {reviewsCount !== undefined && (
          <span className="ml-1 text-sm text-gray-500">({reviewsCount})</span>
        )}
      </div>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Star className={cn(starSize, 'fill-amber-400 text-amber-400')} />
      <span className="font-semibold text-gray-900">{value.toFixed(1)}</span>
      {reviewsCount !== undefined && (
        <span
          className={cn(
            'text-gray-500',
            size === 'sm' ? 'text-sm' : 'text-base',
          )}
        >
          ({reviewsCount})
        </span>
      )}
    </span>
  );
}
