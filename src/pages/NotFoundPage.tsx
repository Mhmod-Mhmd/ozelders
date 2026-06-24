import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';

export function NotFoundPage() {
  return (
    <Container>
      <section className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-7xl font-extrabold text-brand-600">404</p>
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="max-w-md text-gray-600">
          The page you’re looking for may have moved or never existed. Let’s get
          you back on track.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to={paths.home} className={buttonVariants()}>
            Back to home
          </Link>
          <Link
            to={paths.tutors}
            className={buttonVariants({ variant: 'outline' })}
          >
            Browse tutors
          </Link>
        </div>
      </section>
    </Container>
  );
}
