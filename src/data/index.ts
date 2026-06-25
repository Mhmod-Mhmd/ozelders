// The static "database" for the mock API. Only the mock backend
// (`src/lib/mock`) should import from here — UI code goes through React Query
// hooks and the feature `api/` modules instead.
export { TUTORS, getTutorById, getFeaturedTutors } from './tutors';
export {
  getSavedTutorIds,
  isTutorSaved,
  addSavedTutor,
  removeSavedTutor,
} from './savedTutors';
export { SUBJECTS, getSubjectByKey } from './subjects';
export { getReviewsForTutor } from './reviews';
export { TESTIMONIALS } from './testimonials';
export { CONVERSATIONS } from './conversations';
