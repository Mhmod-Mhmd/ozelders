import {
  Hero,
  HowItWorks,
  FeaturedTutors,
  SubjectsGrid,
  Testimonials,
  BecomeTutorCTA,
} from '@/features/home/components';

export function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedTutors />
      <SubjectsGrid />
      <Testimonials />
      <BecomeTutorCTA />
    </>
  );
}
