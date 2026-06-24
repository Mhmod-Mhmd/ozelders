import { BadgeCheck, Globe } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { type Tutor } from '../types/tutor.types';

export function ProfileHeader({ tutor }: { tutor: Tutor }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Avatar
          src={tutor.avatarUrl}
          alt={tutor.name}
          size={128}
          className="mx-auto h-32 w-32 sm:mx-0"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {tutor.name}
            </h1>
            <span aria-hidden className="text-2xl">
              {tutor.countryFlag}
            </span>
            {tutor.superTutor && (
              <Badge variant="brand">
                <BadgeCheck className="h-3.5 w-3.5" /> Super Tutor
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {tutor.subject} tutor · {tutor.country}
          </p>
          <p className="mt-3 font-medium text-gray-800">{tutor.headline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <RatingStars
              value={tutor.rating}
              reviewsCount={tutor.reviewsCount}
              size="md"
            />
            <span className="text-gray-600">
              <strong className="text-gray-900">
                {tutor.lessonsCount.toLocaleString()}
              </strong>{' '}
              lessons
            </span>
            <span className="text-gray-600">
              <strong className="text-gray-900">{tutor.studentsCount}</strong>{' '}
              students
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
              <Globe className="h-4 w-4 text-gray-400" /> Speaks:
            </span>
            {tutor.speaks.map((s) => (
              <Badge key={s.language} variant="neutral">
                {s.language} · {s.level}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
