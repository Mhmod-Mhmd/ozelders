import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  ProfileHeader,
  VideoPlaceholder,
  AvailabilityCalendar,
  ReviewsList,
  BookingCard,
} from '@/features/tutors/components';
import {
  useTutor,
  useTutorReviews,
} from '@/features/tutors/hooks/useTutors';
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
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const { data: tutor, isLoading, isError } = useTutor(id);
  const { data: reviewsPage } = useTutorReviews(id, 6);
  const reviews = reviewsPage?.data ?? [];

  if (isLoading) {
    return (
      <Container className="py-8">
        <Skeleton className="h-5 w-32" />
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </Container>
    );
  }

  if (isError || !tutor) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('tutors.notFoundTitle')}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-gray-600">
          {t('tutors.notFoundBody')}
        </p>
        <Link
          to={paths.tutors}
          className={buttonVariants({ className: 'mt-6' })}
        >
          {t('tutors.browseAll')}
        </Link>
      </Container>
    );
  }

  return (
    <div className="bg-gray-50">
      <Container className="py-8">
        <Link
          to={paths.tutors}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> {t('tutors.backToTutors')}
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ProfileHeader tutor={tutor} />

            <ProfileSection title={t('tutors.sections.about')}>
              <p className="leading-relaxed text-gray-700">{tutor.bio}</p>
            </ProfileSection>

            <ProfileSection title={t('tutors.sections.introVideo')}>
              <VideoPlaceholder poster={tutor.avatarUrl} name={tutor.name} />
            </ProfileSection>

            <ProfileSection title={t('tutors.sections.specialties')}>
              <div className="flex flex-wrap gap-2">
                {tutor.tags.map((tag) => (
                  <Badge key={tag} variant="brand">
                    {tag}
                  </Badge>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection
              title={t('tutors.sections.availability')}
              subtitle={t('tutors.sections.availabilitySubtitle')}
            >
              <AvailabilityCalendar availability={tutor.availability} />
            </ProfileSection>

            <ProfileSection
              title={t('tutors.reviewsTitle', { count: tutor.reviewsCount })}
            >
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
