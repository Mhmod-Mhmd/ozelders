import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';
import { type Tutor } from '../types/tutor.types';

/** Promo/video rail card shown beside the student tutor lists. */
export function VideoPromoCard({ tutor }: { tutor: Tutor }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
      <div className="relative aspect-video bg-linear-to-br from-brand-500 to-brand-700">
        <img
          src={tutor.avatarUrl}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <p className="absolute top-3 start-4 max-w-[70%] text-lg font-extrabold tracking-tight text-white drop-shadow">
          {t('student.promo.title', { subject: tutor.subject })}
        </p>
        <button
          type="button"
          aria-label={t('student.promo.play')}
          className="absolute bottom-3 end-3 grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-white shadow-lg transition-transform hover:scale-105"
        >
          <Play className="h-5 w-5 fill-current rtl:-scale-x-100" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900">{tutor.name}</p>
        <p className="mt-0.5 text-xs text-gray-500">{tutor.headline}</p>
        <Link
          to={paths.tutorProfile(tutor.id)}
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className: 'mt-3 w-full',
          })}
        >
          {t('student.promo.viewSchedule')}
        </Link>
      </div>
    </div>
  );
}
