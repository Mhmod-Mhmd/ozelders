import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, Globe, Heart, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { useCurrency, formatPrice } from '@/currency';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { type Tutor } from '../types/tutor.types';

/**
 * Rich tutor row used across the logged-in student area (discovery list, saved
 * tutors): avatar, badges, languages, price and the three headline stats.
 */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-base font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

interface StudentTutorCardProps {
  tutor: Tutor;
  /** Render the heart filled (the tutor is in the student's saved list). */
  saved?: boolean;
  /** Toggle the saved state. */
  onToggleSave?: (tutor: Tutor) => void;
}

export function StudentTutorCard({
  tutor,
  saved = false,
  onToggleSave,
}: StudentTutorCardProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useCurrency();
  const locale = i18n.language;
  const profile = paths.tutorProfile(tutor.id);
  const speaks = tutor.speaks
    .map((s) => `${s.language} (${s.level})`)
    .join(', ');

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Avatar */}
        <Link
          to={profile}
          className="mx-auto shrink-0 sm:mx-0"
          aria-label={t('tutors.viewProfile', { name: tutor.name })}
        >
          <Avatar
            src={tutor.avatarUrl}
            alt={tutor.name}
            size={128}
            className="h-32 w-32 rounded-2xl"
          />
        </Link>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link
                  to={profile}
                  className="text-lg font-bold text-gray-900 hover:text-brand-600"
                >
                  {tutor.name}
                </Link>
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-500" />
                <span aria-hidden className="text-lg leading-none">
                  {tutor.countryFlag}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {tutor.superTutor && (
                  <Badge variant="brand">
                    <BadgeCheck className="h-3.5 w-3.5" /> {t('tutors.superTutor')}
                  </Badge>
                )}
                <Badge variant="neutral">{t('tutors.professional')}</Badge>
              </div>

              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Globe className="h-4 w-4 text-gray-400" />
                {tutor.subject}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t('tutors.speaks', { languages: speaks })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleSave?.(tutor)}
              aria-label={saved ? t('tutors.removeSaved') : t('tutors.saveTutor')}
              aria-pressed={saved}
              className={cn(
                'rounded-full p-2 transition-colors hover:bg-gray-50',
                saved
                  ? 'text-rose-500'
                  : 'text-gray-400 hover:text-rose-500',
              )}
            >
              <Heart className={cn('h-5 w-5', saved && 'fill-current')} />
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{tutor.headline}</span>
            {' — '}
            <span className="text-gray-600">{tutor.bio}</span>
          </p>
          <Link
            to={profile}
            className="mt-1 inline-block text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
          >
            {t('tutors.learnMore')}
          </Link>
        </div>

        {/* Price + actions */}
        <div className="flex shrink-0 flex-col items-stretch gap-4 border-t border-gray-100 pt-4 sm:w-52 sm:border-t-0 sm:border-s sm:pt-0 sm:ps-5">
          <div className="text-center sm:text-start">
            <p className="text-2xl font-extrabold text-gray-900">
              {formatPrice(tutor.pricePerHour, currency, locale)}
            </p>
            <p className="text-xs text-gray-500">{t('tutors.lessonDuration')}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Stat
              value={tutor.rating.toFixed(1)}
              label={t('tutors.reviewsCount', { count: tutor.reviewsCount })}
            />
            <Stat
              value={tutor.studentsCount.toLocaleString(locale)}
              label={t('tutors.studentsLabel')}
            />
            <Stat
              value={tutor.lessonsCount.toLocaleString(locale)}
              label={t('tutors.lessonsLabel')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Link to={profile} className={buttonVariants({ size: 'md' })}>
              {t('tutors.bookTrial')}
            </Link>
            <Link
              to={profile}
              className={buttonVariants({ variant: 'outline', size: 'md' })}
            >
              {t('tutors.sendMessage')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
