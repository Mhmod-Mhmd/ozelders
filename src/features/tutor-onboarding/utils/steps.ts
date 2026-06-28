import { STEP_IDS, type StepId } from '../types/onboarding.types';

/**
 * Step order + small navigation helpers shared by the stepper, the layout and
 * each step's Back / Save-and-continue buttons. The order lives in one place
 * (`STEP_IDS`) so adding or reordering a step is a single-line change.
 */

export { STEP_IDS };
export type { StepId };

export function stepIndex(id: StepId): number {
  return STEP_IDS.indexOf(id);
}

export function nextStepId(id: StepId): StepId | null {
  const i = stepIndex(id);
  return i >= 0 && i < STEP_IDS.length - 1 ? STEP_IDS[i + 1] : null;
}

export function prevStepId(id: StepId): StepId | null {
  const i = stepIndex(id);
  return i > 0 ? STEP_IDS[i - 1] : null;
}

/**
 * A step is reachable when every step before it has been saved at least once
 * (or it is itself already complete). This keeps the stepper navigable without
 * letting the tutor skip ahead past unfinished sections.
 */
export function isStepUnlocked(id: StepId, completed: StepId[]): boolean {
  if (completed.includes(id)) return true;
  const idx = stepIndex(id);
  return STEP_IDS.slice(0, idx).every((s) => completed.includes(s));
}
