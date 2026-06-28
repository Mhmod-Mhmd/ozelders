import { useTranslation } from 'react-i18next';
import { MessageCircle, Clock, CalendarCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { type Tutor } from '../types/tutor.types';

export function BookingCard({ tutor }: { tutor: Tutor }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="text-3xl font-extrabold text-gray-900">
            ${tutor.pricePerHour}
          </span>
          <span className="text-gray-500"> {t('tutors.perHour')}</span>
        </p>
        <RatingStars value={tutor.rating} reviewsCount={tutor.reviewsCount} />
      </div>

      <div className="mt-5 space-y-2">
        <Button className="w-full" size="lg">
          {t('tutors.bookTrial')}
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          <MessageCircle className="h-4 w-4" />
          {t('tutors.sendMessage')}
        </Button>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-gray-400" />
          {t('tutors.responds', { time: tutor.responseTime })}
        </li>
        <li className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 shrink-0 text-gray-400" />
          {t('tutors.lessonsTaught', {
            lessons: tutor.lessonsCount.toLocaleString(i18n.language),
          })}
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
          {t('tutors.freeTrialNote')}
        </li>
      </ul>
    </div>
  );
}
