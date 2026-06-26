import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TutorCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { buttonVariants } from '@/components/ui/button-variants';
import { TutorCard } from '@/features/tutors/components/TutorCard';
import { useFeaturedTutors } from '@/features/tutors/hooks/useTutors';
import { paths } from '@/router/paths';

export function FeaturedTutors() {
  const { t } = useTranslation();
  // Real, top-rated tutors straight from the API (GET /tutors?sort=top-rated).
  const { data, isLoading, isError, refetch } = useFeaturedTutors(4);
  const tutors = data?.data ?? [];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow={t('home.featured.eyebrow')}
            title={t('home.featured.title')}
            subtitle={t('home.featured.subtitle')}
          />
          <Link
            to={paths.studentFindTutor}
            className={buttonVariants({ variant: 'outline' })}
          >
            {t('home.featured.viewAll')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isError ? (
          <ErrorState className="mt-10" onRetry={() => refetch()} />
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TutorCardSkeleton key={i} />
                ))
              : tutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
          </div>
        )}
      </Container>
    </section>
  );
}
