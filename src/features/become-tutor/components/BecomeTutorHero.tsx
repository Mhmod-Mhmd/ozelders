import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';
import { cn } from '@/utils/cn';

/** The three onboarding steps, keyed into the `becomeTutor.hero.steps.*` copy. */
const STEPS = ['signUp', 'getApproved', 'startEarning'] as const;

/** One photo plus two duplicates fanned out behind it for the stacked effect. */
const COLLAGE_IMAGE = 'https://i.pravatar.cc/600?img=45';

/**
 * Hero for the "Become a tutor" landing page: headline, a numbered three-step
 * path (sign up → get approved → start earning) connected by rules, a primary
 * call to action, and a stacked-photo collage. Mobile-first and RTL-safe.
 */
export function BecomeTutorHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="py-10 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy + steps + CTA */}
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              {t('becomeTutor.hero.title')}
            </h1>

            <ol className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-0">
              {STEPS.map((step, index) => {
                const isFirst = index === 0;
                const isLast = index === STEPS.length - 1;
                return (
                  <li key={step} className="sm:flex-1">
                    {/* Number + connector rule */}
                    <div className="flex items-center">
                      <span
                        className={cn(
                          'grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base font-bold',
                          isFirst
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-900',
                        )}
                      >
                        {index + 1}
                      </span>
                      {!isLast && (
                        <span
                          aria-hidden
                          className="me-2 hidden h-px flex-1 bg-gray-200 sm:block"
                        />
                      )}
                    </div>

                    <div className="mt-3 sm:pe-6">
                      <h3 className="text-base font-bold text-gray-900">
                        {t(`becomeTutor.hero.steps.${step}.title`)}
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {t(`becomeTutor.hero.steps.${step}.subtitle`)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10">
              <Link
                to={paths.login}
                className={buttonVariants({ size: 'lg' })}
              >
                {t('becomeTutor.hero.cta')}
              </Link>
            </div>
          </div>

          {/* Stacked-photo collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="relative aspect-[4/3]">
              <img
                src={COLLAGE_IMAGE}
                alt=""
                aria-hidden
                className="absolute end-0 top-6 hidden h-full w-[78%] rounded-3xl object-cover opacity-40 shadow-card sm:block"
              />
              <img
                src={COLLAGE_IMAGE}
                alt=""
                aria-hidden
                className="absolute end-[6%] top-3 hidden h-full w-[82%] rounded-3xl object-cover opacity-70 shadow-card sm:block"
              />
              <img
                src={COLLAGE_IMAGE}
                alt={t('becomeTutor.hero.imageAlt')}
                className="absolute end-[12%] top-0 h-full w-[86%] rounded-3xl object-cover shadow-card-hover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
