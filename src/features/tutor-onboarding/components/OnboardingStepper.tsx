import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/utils/cn';
import { paths } from '@/router/paths';
import { STEP_IDS, isStepUnlocked, type StepId } from '../utils/steps';

interface OnboardingStepperProps {
  /** The step currently being edited, or `null` on the terminal screen. */
  current: StepId | null;
  /** Steps saved at least once — these render a checkmark. */
  completed: StepId[];
}

/**
 * The eight-step progress bar. Saved steps show a checkmark, the active step
 * shows its number in a dark badge, and reachable steps are clickable so the
 * tutor can jump back to review. Scrolls horizontally on small screens and
 * mirrors correctly in RTL.
 */
export function OnboardingStepper({ current, completed }: OnboardingStepperProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <nav
      aria-label={t('onboarding.stepper.label')}
      className="border-b border-gray-100 bg-gray-50"
    >
      <Container className="flex items-center gap-1 overflow-x-auto py-3 sm:gap-2">
        {STEP_IDS.map((id, index) => {
          const isCurrent = id === current;
          const isDone = completed.includes(id) && !isCurrent;
          const unlocked = isStepUnlocked(id, completed);

          const badge = (
            <span className="flex shrink-0 items-center gap-2 px-1">
              <span
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold',
                  isCurrent || isDone
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500',
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  'text-sm font-semibold whitespace-nowrap',
                  isCurrent || isDone ? 'text-gray-900' : 'text-gray-500',
                )}
              >
                {t(`onboarding.stepper.${id}`)}
              </span>
            </span>
          );

          return (
            <div key={id} className="flex shrink-0 items-center gap-1 sm:gap-2">
              {unlocked && !isCurrent ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(paths.becomeTutorOnboardingStep(id))
                  }
                  className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  {badge}
                </button>
              ) : (
                <span aria-current={isCurrent ? 'step' : undefined}>
                  {badge}
                </span>
              )}
              {index < STEP_IDS.length - 1 && (
                <ChevronRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-gray-300 rtl:rotate-180"
                />
              )}
            </div>
          );
        })}
      </Container>
    </nav>
  );
}
