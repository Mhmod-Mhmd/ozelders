import { BecomeTutorHero } from '@/features/become-tutor';

/**
 * Public "Become a tutor" landing page, shown when a visitor clicks the
 * Become-a-tutor entry points (navbar, home CTA, footer). Composes the
 * onboarding hero; additional marketing sections can be added below it.
 */
export function BecomeTutorPage() {
  return (
    <>
      <BecomeTutorHero />
    </>
  );
}
