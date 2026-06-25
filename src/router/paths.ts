/**
 * Centralized route paths. Reference these constants instead of hard-coding
 * URL strings so routes can be renamed or restructured in one place.
 */
export const paths = {
  home: '/',
  tutors: '/tutors',
  tutorProfile: (id: string) => `/tutors/${id}`,
  studentHome: '/student',
} as const;
