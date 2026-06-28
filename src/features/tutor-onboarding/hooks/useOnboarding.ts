import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { type Availability } from '@/features/tutors/types/tutor.types';
import {
  getApplication,
  saveAbout,
  saveAvailability,
  saveCertification,
  saveDescription,
  saveEducation,
  savePhoto,
  savePricing,
  saveVideo,
  submitApplication,
} from '../api/onboarding.api';
import {
  type AboutInput,
  type CertificationInput,
  type DescriptionInput,
  type EducationInput,
  type PhotoInput,
  type PricingInput,
  type TutorApplication,
  type VideoInput,
} from '../types/onboarding.types';

/** Shape of the router outlet context the layout provides to each step. */
export interface OnboardingOutletContext {
  application: TutorApplication;
}

/** Read the loaded application draft inside any step (provided by the layout). */
export function useOnboardingApplication(): TutorApplication {
  return useOutletContext<OnboardingOutletContext>().application;
}

/** Query-key factory for the tutor-onboarding draft. */
export const onboardingKeys = {
  all: ['tutor-application'] as const,
  current: () => [...onboardingKeys.all, 'current'] as const,
};

/** The in-progress application draft (source of truth for every step form). */
export function useApplication() {
  return useQuery({
    queryKey: onboardingKeys.current(),
    queryFn: getApplication,
    staleTime: 30 * 1000,
  });
}

/**
 * Build a step-save mutation whose `onSuccess` writes the returned draft back
 * into the cache, so the stepper checkmarks and every other step stay in sync
 * without a refetch.
 */
function useStepMutation<TInput>(
  mutationFn: (input: TInput) => Promise<TutorApplication>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (application) => {
      queryClient.setQueryData(onboardingKeys.current(), application);
    },
  });
}

export const useSaveAbout = () => useStepMutation<AboutInput>(saveAbout);
export const useSavePhoto = () => useStepMutation<PhotoInput>(savePhoto);
export const useSaveCertification = () =>
  useStepMutation<CertificationInput>(saveCertification);
export const useSaveEducation = () =>
  useStepMutation<EducationInput>(saveEducation);
export const useSaveDescription = () =>
  useStepMutation<DescriptionInput>(saveDescription);
export const useSaveVideo = () => useStepMutation<VideoInput>(saveVideo);
export const useSaveAvailability = () =>
  useStepMutation<Availability>(saveAvailability);
export const useSavePricing = () =>
  useStepMutation<PricingInput & { currency: string }>(savePricing);
export const useSubmitApplication = () => useStepMutation<void>(submitApplication);
