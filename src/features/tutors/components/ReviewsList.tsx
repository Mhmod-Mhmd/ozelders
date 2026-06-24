import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { type Review, type Tutor } from '../types/tutor.types';

interface ReviewsListProps {
  tutor: Tutor;
  reviews: Review[];
}

export function ReviewsList({ tutor, reviews }: ReviewsListProps) {
  return (
    <div>
      <div className="flex items-center gap-5 rounded-xl bg-gray-50 p-5">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-gray-900">
            {tutor.rating.toFixed(1)}
          </p>
          <div className="mt-1 flex justify-center">
            <RatingStars value={tutor.rating} variant="stars" />
          </div>
        </div>
        <div className="border-l border-gray-200 pl-5">
          <p className="font-semibold text-gray-900">Excellent</p>
          <p className="text-sm text-gray-500">
            Based on {tutor.reviewsCount} verified reviews
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-5">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={review.authorAvatarUrl}
                  alt={review.author}
                  size={40}
                />
                <div>
                  <p className="font-semibold text-gray-900">{review.author}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
              <RatingStars value={review.rating} variant="stars" />
            </div>
            <p className="mt-3 text-gray-700">{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
