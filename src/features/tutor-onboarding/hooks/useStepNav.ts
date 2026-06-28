import { useNavigate } from 'react-router-dom';
import { paths } from '@/router/paths';
import { nextStepId, prevStepId, type StepId } from '../utils/steps';

/**
 * Back/next navigation for a wizard step. `goBack` returns to the previous step
 * and `goNext` advances to the following one (both no-ops at the ends), so step
 * components never hard-code sibling URLs.
 */
export function useStepNav(step: StepId) {
  const navigate = useNavigate();
  const prev = prevStepId(step);
  const next = nextStepId(step);

  return {
    isFirst: prev === null,
    goBack: () =>
      prev && navigate(paths.becomeTutorOnboardingStep(prev)),
    goNext: () =>
      next && navigate(paths.becomeTutorOnboardingStep(next)),
  };
}
