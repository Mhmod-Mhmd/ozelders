import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';

export function SubjectsGrid() {
  const { t, i18n } = useTranslation();
  const { data: subjects = [], isLoading, isError, refetch } = useSubjects();

  return (
    <section id="subjects" className="scroll-mt-20 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={t('home.subjects.eyebrow')}
          title={t('home.subjects.title')}
          subtitle={t('home.subjects.subtitle')}
        />
        {isError ? (
          <ErrorState className="mt-12" onRetry={() => refetch()} />
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-23 rounded-2xl" />
                ))
              : subjects.map((subject) => (
                  <Link
                    key={subject.key}
                    to={`${paths.tutors}?category=${subject.key}`}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <span
                      className={cn(
                        'grid h-12 w-12 shrink-0 place-items-center rounded-xl',
                        subject.accent,
                      )}
                    >
                      <subject.icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-brand-600">
                        {subject.name}
                      </h3>
                      <p className="truncate text-sm text-gray-500">
                        {subject.blurb}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-gray-400">
                        {t('home.subjects.tutorsCount', {
                          count: subject.tutorsCount,
                          formatted: subject.tutorsCount.toLocaleString(
                            i18n.language,
                          ),
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </Container>
    </section>
  );
}
