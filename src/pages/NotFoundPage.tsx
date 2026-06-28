import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container>
      <section className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-7xl font-extrabold text-brand-600">
          {t('notFound.code')}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('notFound.title')}
        </h1>
        <p className="max-w-md text-gray-600">{t('notFound.body')}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to={paths.home} className={buttonVariants()}>
            {t('notFound.backHome')}
          </Link>
          <Link
            to={paths.tutors}
            className={buttonVariants({ variant: 'outline' })}
          >
            {t('notFound.browseTutors')}
          </Link>
        </div>
      </section>
    </Container>
  );
}
