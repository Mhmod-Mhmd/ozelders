/**
 * Centralized route paths. Reference these constants instead of hard-coding
 * URL strings so routes can be renamed or restructured in one place.
 */
export const paths = {
  home: '/',
  login: '/login',
  becomeTutor: '/become-tutor',
  becomeTutorOnboarding: '/become-tutor/onboarding',
  becomeTutorOnboardingStep: (step: string) =>
    `/become-tutor/onboarding/${step}`,
  becomeTutorOnboardingSubmitted: '/become-tutor/onboarding/submitted',
  tutors: '/tutors',
  tutorProfile: (id: string) => `/tutors/${id}`,
  studentHome: '/student',
  studentFindTutor: '/student/find-tutor',
  studentSaved: '/student/saved',
  studentMessages: '/student/messages',
  studentLessons: '/student/lessons',
  studentSettings: '/student/settings',
} as const;
