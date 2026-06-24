/**
 * Public surface of the `tutors` feature. Import from `@/features/tutors`
 * rather than reaching into individual files, so internals can be refactored
 * freely.
 */
export { getTutors, getTutorById } from './api/tutors.api';
export { useTutors, useTutor, tutorKeys } from './hooks/useTutors';
export type { Tutor, TutorFilters } from './types/tutor.types';
