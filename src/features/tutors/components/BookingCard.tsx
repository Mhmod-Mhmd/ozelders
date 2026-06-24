import { MessageCircle, Clock, CalendarCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { type Tutor } from '../types/tutor.types';

export function BookingCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="text-3xl font-extrabold text-gray-900">
            ${tutor.pricePerHour}
          </span>
          <span className="text-gray-500"> / hour</span>
        </p>
        <RatingStars value={tutor.rating} reviewsCount={tutor.reviewsCount} />
      </div>

      <div className="mt-5 space-y-2">
        <Button className="w-full" size="lg">
          Book trial lesson
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          <MessageCircle className="h-4 w-4" />
          Send message
        </Button>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-gray-400" />
          Responds {tutor.responseTime}
        </li>
        <li className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 shrink-0 text-gray-400" />
          {tutor.lessonsCount.toLocaleString()} lessons taught
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
          Free trial · switch tutors anytime
        </li>
      </ul>
    </div>
  );
}
