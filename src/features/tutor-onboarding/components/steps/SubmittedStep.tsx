import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';

/** Terminal screen shown after the application is submitted for review. */
export function SubmittedStep() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-600">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('onboarding.submitted.title')}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-gray-600">
        {t('onboarding.submitted.body')}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={paths.home} className={buttonVariants({ size: 'lg' })}>
          {t('onboarding.submitted.goHome')}
        </Link>
        <Link
          to={paths.studentFindTutor}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          {t('onboarding.submitted.browseTutors')}
        </Link>
      </div>
    </div>
  );
}
