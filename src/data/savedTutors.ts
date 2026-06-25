/**
 * The logged-in student's saved (hearted) tutors. In a real backend this would
 * be a per-user join table; here it's an in-memory set the mock API reads and
 * mutates so saving/unsaving persists for the lifetime of the page session.
 *
 * Only the mock backend (`src/lib/mock`) should touch these helpers.
 */
const savedTutorIds = new Set<string>(['t1']);

/** All currently saved tutor ids. */
export function getSavedTutorIds(): string[] {
  return [...savedTutorIds];
}

/** Whether a tutor is in the saved list. */
export function isTutorSaved(id: string): boolean {
  return savedTutorIds.has(id);
}

/** Add a tutor to the saved list (idempotent). */
export function addSavedTutor(id: string): void {
  savedTutorIds.add(id);
}

/** Remove a tutor from the saved list (idempotent). */
export function removeSavedTutor(id: string): void {
  savedTutorIds.delete(id);
}
