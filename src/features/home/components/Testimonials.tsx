import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { TESTIMONIALS } from '@/data';

export function Testimonials() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by learners worldwide"
          subtitle="Join millions of students achieving their goals with Ozelders."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-card"
            >
              <RatingStars value={t.rating} variant="stars" />
              <blockquote className="mt-4 flex-1 text-gray-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar src={t.avatarUrl} alt={t.author} size={44} />
                <div>
                  <p className="font-semibold text-gray-900">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
