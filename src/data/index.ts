// The static "database" for the mock API. Only the mock backend
// (`src/lib/mock`) should import from here — UI code goes through React Query
// hooks and the feature `api/` modules instead.
export { TUTORS, getTutorById, getFeaturedTutors } from './tutors';
export { authenticate, findUserById } from './auth';
export type { AuthUser, UserRole } from './auth';
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
export {
  getAccount,
  updateAccount,
  setAccountAvatar,
  connectSocial,
  disconnectSocial,
  updateEmail,
  verifyPassword,
  setPassword,
  updateNotificationPrefs,
  updateAutoconfirm,
  setCalendarConnected,
} from './account';
export type {
  AccountRecord,
  SocialProvider,
  SocialConnection,
  AutoconfirmMode,
  NotificationPrefs,
} from './account';
export {
  getCards,
  addCard,
  removeCard,
  getPaymentHistory,
  detectBrand,
} from './payments';
export type { PaymentCard, PaymentTransaction, CardBrand } from './payments';
export {
  getTutorApplication,
  saveAbout,
  savePhoto,
  saveCertification,
  saveEducation,
  saveDescription,
  saveVideo,
  saveAvailability,
  savePricing,
  submitTutorApplication,
} from './tutorApplication';
