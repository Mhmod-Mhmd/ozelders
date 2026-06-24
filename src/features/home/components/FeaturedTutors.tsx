import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buttonVariants } from '@/components/ui/button-variants';
import { TutorCard } from '@/features/tutors/components/TutorCard';
import { getFeaturedTutors } from '@/data';
import { paths } from '@/router/paths';

export function FeaturedTutors() {
  const tutors = getFeaturedTutors(4);

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Featured tutors"
            title="Meet our top-rated tutors"
            subtitle="Hand-picked, highly-rated tutors loved by thousands of students."
          />
          <Link
            to={paths.tutors}
            className={buttonVariants({ variant: 'outline' })}
          >
            View all tutors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </Container>
    </section>
  );
}
