import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to={paths.home}
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="Ozelders home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
        <GraduationCap className="h-5 w-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-gray-900">
        Ozelders
      </span>
    </Link>
  );
}
