import { httpClient } from '@/lib/axios';
import { type Availability } from '@/features/tutors/types/tutor.types';
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

/**
 * Typed client for the tutor-onboarding draft. Every call goes through the
 * shared `httpClient`, so swapping the mock backend for a real API needs no
 * changes here or in the hooks/components above it.
 */

const RESOURCE = '/tutor-application';

/** The signed-in user's in-progress application draft. */
export async function getApplication(): Promise<TutorApplication> {
  const { data } = await httpClient.get<TutorApplication>(RESOURCE);
  return data;
}

export async function saveAbout(input: AboutInput): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/about`,
    input,
  );
  return data;
}

export async function savePhoto(input: PhotoInput): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/photo`,
    input,
  );
  return data;
}

export async function saveCertification(
  input: CertificationInput,
): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/certification`,
    input,
  );
  return data;
}

export async function saveEducation(
  input: EducationInput,
): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/education`,
    input,
  );
  return data;
}

export async function saveDescription(
  input: DescriptionInput,
): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/description`,
    input,
  );
  return data;
}

export async function saveVideo(input: VideoInput): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/video`,
    input,
  );
  return data;
}

export async function saveAvailability(
  availability: Availability,
): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/availability`,
    { availability },
  );
  return data;
}

export async function savePricing(
  input: PricingInput & { currency: string },
): Promise<TutorApplication> {
  const { data } = await httpClient.patch<TutorApplication>(
    `${RESOURCE}/pricing`,
    input,
  );
  return data;
}

/** Submit the completed application for review. */
export async function submitApplication(): Promise<TutorApplication> {
  const { data } = await httpClient.post<TutorApplication>(
    `${RESOURCE}/submit`,
  );
  return data;
}
