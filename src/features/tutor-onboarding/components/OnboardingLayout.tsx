import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/types';
import {
  useApplication,
  type OnboardingOutletContext,
} from '../hooks/useOnboarding';
import { STEP_IDS, type StepId } from '../utils/steps';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingStepper } from './OnboardingStepper';

/** Derive the active step from the URL's last segment (null on `/submitted`). */
function currentStepFromPath(pathname: string): StepId | null {
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  return (STEP_IDS as readonly string[]).includes(last)
    ? (last as StepId)
    : null;
}

/**
 * Frame for the whole wizard: header + progress stepper + the active step. It
 * owns the single `GET /tutor-application` request and renders loading/error
 * states once for the entire flow, then hands the loaded draft to each step
 * through the router outlet context.
 */
export function OnboardingLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const {
    data: application,
    isLoading,
    isError,
    error,
    refetch,
  } = useApplication();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <OnboardingHeader />
      <OnboardingStepper
        current={currentStepFromPath(location.pathname)}
        completed={application?.completedSteps ?? []}
      />
      <main className="flex-1">
        <Container className="py-10 lg:py-14">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              {t('common.loading')}
            </div>
          ) : isError || !application ? (
            <ErrorState
              message={error instanceof ApiError ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : (
            <Outlet
              context={{ application } satisfies OnboardingOutletContext}
            />
          )}
        </Container>
      </main>
    </div>
  );
}
