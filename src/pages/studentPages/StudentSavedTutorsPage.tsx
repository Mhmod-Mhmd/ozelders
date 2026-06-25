import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartOff } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { TutorCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  StudentTutorCard,
  VideoPromoCard,
} from '@/features/tutors/components';
import {
  useSavedTutors,
  useToggleSavedTutor,
} from '@/features/tutors/hooks/useTutors';
import { paths } from '@/router/paths';

/**
 * The student's saved tutors (reached from the heart icon in the header). Same
 * card + promo rail as the discovery page, listing only hearted tutors.
 */
export function StudentSavedTutorsPage() {
  const { t } = useTranslation();
  const query = useSavedTutors();
  const tutors = query.data?.data ?? [];
  const total = query.data?.meta.total ?? 0;
  const featured = tutors[0];

  const toggleSave = useToggleSavedTutor();

  return (
    <div className="min-h-[60vh] bg-gray-50">
      <Container className="px-3.75 pt-8 pb-2 sm:px-3.75 lg:px-3.75">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {query.isLoading
            ? t('common.loading')
            : t('saved.heading', { count: total })}
        </h1>
      </Container>

      <Container className="px-3.75 py-6 sm:px-3.75 lg:px-3.75">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="space-y-5">
            {query.isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <TutorCardSkeleton key={i} />
              ))
            ) : query.isError ? (
              <ErrorState onRetry={() => query.refetch()} />
            ) : tutors.length > 0 ? (
              tutors.map((tutor) => (
                <StudentTutorCard
                  key={tutor.id}
                  tutor={tutor}
                  saved
                  onToggleSave={(t) =>
                    toggleSave.mutate({ tutor: t, saved: true })
                  }
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <HeartOff className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {t('saved.emptyTitle')}
                </h3>
                <p className="mt-1 text-gray-500">{t('saved.emptyBody')}</p>
                <Link
                  to={paths.studentFindTutor}
                  className={buttonVariants({ className: 'mt-5' })}
                >
                  {t('saved.browseTutors')}
                </Link>
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="mt-6 hidden lg:mt-0 lg:block">
            {featured && (
              <div className="sticky top-20">
                <VideoPromoCard tutor={featured} />
              </div>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
