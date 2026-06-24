import { cn } from '@/utils/cn';

interface AvatarProps {
  src: string;
  alt: string;
  /** Rendered width/height in pixels. */
  size?: number;
  ring?: boolean;
  className?: string;
}

export function Avatar({ src, alt, size = 56, ring, className }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: size, height: size }}
      className={cn(
        'shrink-0 rounded-full object-cover',
        ring && 'ring-2 ring-white',
        className,
      )}
    />
  );
}
