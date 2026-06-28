import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTestimonials } from '@/features/testimonials/hooks/useTestimonials';

export function Testimonials() {
  const { t } = useTranslation();
  const { data: testimonials = [], isLoading, isError, refetch } =
    useTestimonials();

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={t('home.testimonials.eyebrow')}
          title={t('home.testimonials.title')}
          subtitle={t('home.testimonials.subtitle')}
        />
        {isError ? (
          <ErrorState className="mt-12" onRetry={() => refetch()} />
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-2xl" />
                ))
              : testimonials.map((item) => (
                  <figure
                    key={item.id}
                    className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-card"
                  >
                    <RatingStars value={item.rating} variant="stars" />
                    <blockquote className="mt-4 flex-1 text-gray-700">
                      “{item.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <Avatar src={item.avatarUrl} alt={item.author} size={44} />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.author}
                        </p>
                        <p className="text-sm text-gray-500">{item.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
          </div>
        )}
      </Container>
    </section>
  );
}
