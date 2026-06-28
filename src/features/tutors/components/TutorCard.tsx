import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, BadgeCheck, Clock, Globe } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';
import { type Tutor } from '../types/tutor.types';

interface TutorCardProps {
  tutor: Tutor;
  className?: string;
}

export function TutorCard({ tutor, className }: TutorCardProps) {
  const { t, i18n } = useTranslation();
  const profile = paths.tutorProfile(tutor.id);

  return (
    <article
      className={cn(
        'group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row',
        className,
      )}
    >
      <Link to={profile} className="mx-auto shrink-0 sm:mx-0">
        <Avatar
          src={tutor.avatarUrl}
          alt={tutor.name}
          size={112}
          className="h-28 w-28"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                to={profile}
                className="text-lg font-bold text-gray-900 hover:text-brand-600"
              >
                {tutor.name}
              </Link>
              <span aria-hidden className="text-lg">
                {tutor.countryFlag}
              </span>
              {tutor.superTutor && (
                <Badge variant="brand">
                  <BadgeCheck className="h-3.5 w-3.5" /> {t('tutors.superTutor')}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {t('tutors.subjectCountryLine', {
                subject: tutor.subject,
                country: tutor.country,
              })}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('tutors.saveTutor')}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-rose-500"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {tutor.headline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tutor.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
          {tutor.isNativeSpeaker && (
            <Badge variant="success">
              <Globe className="h-3.5 w-3.5" /> {t('tutors.nativeSpeaker')}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="flex flex-col gap-1">
            <RatingStars
              value={tutor.rating}
              reviewsCount={tutor.reviewsCount}
            />
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />{' '}
              {t('tutors.lessonsAndResponds', {
                lessons: tutor.lessonsCount.toLocaleString(i18n.language),
                time: tutor.responseTime,
              })}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('tutors.trialFrom')}</p>
            <p className="text-xl font-extrabold text-gray-900">
              ${tutor.pricePerHour}
              <span className="text-sm font-medium text-gray-500">
                {t('tutors.perHourShort')}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={profile}
            className={buttonVariants({ className: 'flex-1' })}
          >
            {t('tutors.bookTrialShort')}
          </Link>
          <Link
            to={profile}
            className={buttonVariants({
              variant: 'outline',
              className: 'flex-1',
            })}
          >
            {t('tutors.viewProfileShort')}
          </Link>
        </div>
      </div>
    </article>
  );
}
