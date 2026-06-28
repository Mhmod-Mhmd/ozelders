import { EMPTY_AVAILABILITY } from '@/features/tutor-onboarding/utils/onboardingOptions';
import {
  type AboutInput,
  type CertificationInput,
  type DescriptionInput,
  type EducationInput,
  type PhotoInput,
  type StepId,
  type TutorApplication,
  type VideoInput,
} from '@/features/tutor-onboarding/types/onboarding.types';
import { type Availability } from '@/features/tutors/types/tutor.types';

/**
 * The in-progress tutor-onboarding application. In a real backend this is the
 * draft row behind `GET /tutor-application` for the signed-in user; here it is a
 * mutable in-memory record the mock API reads and patches step by step, so a
 * tutor's progress survives navigation for the lifetime of the page session.
 *
 * Only the mock backend (`src/lib/mock`) should touch these helpers.
 */

let application: TutorApplication = {
  about: {
    firstName: 'Mahmoud',
    lastName: 'Mahmed',
    email: 'mm6107237@gmail.com',
    country: '',
    subject: '',
    languages: [{ language: 'English', level: 'native' }],
    phoneCountry: 'TR',
    phoneNumber: '',
    over18: false,
  },
  photo: { photoUrl: '' },
  certification: { hasNone: false, certificates: [] },
  education: { hasNone: false, educations: [] },
  description: { headline: '', introduction: '', teachingStyle: '' },
  video: { url: '' },
  availability: { availability: EMPTY_AVAILABILITY },
  pricing: { hourlyRate: 0, currency: 'USD' },
  completedSteps: [],
  submitted: false,
};

/** Record the step as saved so the stepper shows its checkmark. */
function markComplete(step: StepId): void {
  if (!application.completedSteps.includes(step)) {
    application = {
      ...application,
      completedSteps: [...application.completedSteps, step],
    };
  }
}

/** The current draft (returned by `GET /tutor-application`). */
export function getTutorApplication(): TutorApplication {
  return application;
}

export function saveAbout(value: AboutInput): TutorApplication {
  application = { ...application, about: value };
  markComplete('about');
  return application;
}

export function savePhoto(value: PhotoInput): TutorApplication {
  application = { ...application, photo: value };
  markComplete('photo');
  return application;
}

export function saveCertification(value: CertificationInput): TutorApplication {
  application = { ...application, certification: value };
  markComplete('certification');
  return application;
}

export function saveEducation(value: EducationInput): TutorApplication {
  application = { ...application, education: value };
  markComplete('education');
  return application;
}

export function saveDescription(value: DescriptionInput): TutorApplication {
  application = { ...application, description: value };
  markComplete('description');
  return application;
}

export function saveVideo(value: VideoInput): TutorApplication {
  application = { ...application, video: value };
  markComplete('video');
  return application;
}

export function saveAvailability(value: Availability): TutorApplication {
  application = { ...application, availability: { availability: value } };
  markComplete('availability');
  return application;
}

export function savePricing(
  hourlyRate: number,
  currency: string,
): TutorApplication {
  application = { ...application, pricing: { hourlyRate, currency } };
  markComplete('pricing');
  return application;
}

/** Mark the whole application as submitted for review. */
export function submitTutorApplication(): TutorApplication {
  application = { ...application, submitted: true };
  return application;
}
