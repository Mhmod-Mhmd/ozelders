import {
  OnboardingLayout,
  AboutStep,
  PhotoStep,
  CertificationStep,
  EducationStep,
  DescriptionStep,
  VideoStep,
  AvailabilityStep,
  PricingStep,
  SubmittedStep,
} from '@/features/tutor-onboarding';

/**
 * Route components for the tutor-onboarding wizard. Pages stay thin: each one
 * just renders the matching feature step (or the wizard frame). All data
 * fetching, validation and business logic live in the `tutor-onboarding`
 * feature, per the project's feature-based architecture.
 */

export function TutorOnboardingLayoutPage() {
  return <OnboardingLayout />;
}

export function TutorAboutPage() {
  return <AboutStep />;
}

export function TutorPhotoPage() {
  return <PhotoStep />;
}

export function TutorCertificationPage() {
  return <CertificationStep />;
}

export function TutorEducationPage() {
  return <EducationStep />;
}

export function TutorDescriptionPage() {
  return <DescriptionStep />;
}

export function TutorVideoPage() {
  return <VideoStep />;
}

export function TutorAvailabilityPage() {
  return <AvailabilityStep />;
}

export function TutorPricingPage() {
  return <PricingStep />;
}

export function TutorApplicationSubmittedPage() {
  return <SubmittedStep />;
}
