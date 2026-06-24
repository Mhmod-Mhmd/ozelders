import { type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  ProfileHeader,
  VideoPlaceholder,
  AvailabilityCalendar,
  ReviewsList,
  BookingCard,
} from '@/features/tutors/components';
import { getTutorById, getReviewsForTutor } from '@/data';
import { paths } from '@/router/paths';

function ProfileSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function TutorProfilePage() {
  const { id = '' } = useParams();
  const tutor = getTutorById(id);

  if (!tutor) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Tutor not found</h1>
        <p className="mx-auto mt-2 max-w-md text-gray-600">
          This tutor may have moved or no longer exists.
        </p>
        <Link
          to={paths.tutors}
          className={buttonVariants({ className: 'mt-6' })}
        >
          Browse all tutors
        </Link>
      </Container>
    );
  }

  const reviews = getReviewsForTutor(tutor.id, 6);

  return (
    <div className="bg-gray-50">
      <Container className="py-8">
        <Link
          to={paths.tutors}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tutors
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ProfileHeader tutor={tutor} />

            <ProfileSection title="About me">
              <p className="leading-relaxed text-gray-700">{tutor.bio}</p>
            </ProfileSection>

            <ProfileSection title="Intro video">
              <VideoPlaceholder poster={tutor.avatarUrl} name={tutor.name} />
            </ProfileSection>

            <ProfileSection title="Specialties">
              <div className="flex flex-wrap gap-2">
                {tutor.tags.map((tag) => (
                  <Badge key={tag} variant="brand">
                    {tag}
                  </Badge>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection
              title="Availability"
              subtitle="Pick a time that works for you. Times shown in your local timezone."
            >
              <AvailabilityCalendar availability={tutor.availability} />
            </ProfileSection>

            <ProfileSection title={`Reviews (${tutor.reviewsCount})`}>
              <ReviewsList tutor={tutor} reviews={reviews} />
            </ProfileSection>
          </div>

          <aside>
            <BookingCard tutor={tutor} />
          </aside>
        </div>
      </Container>
    </div>
  );
}
