import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';

const BENEFITS = ['findStudents', 'growBusiness', 'getPaid'];

export function BecomeTutorCTA() {
  const { t } = useTranslation();

  return (
    <section id="become-tutor" className="scroll-mt-20 py-16 lg:py-24">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 sm:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                {t('home.becomeTutorCta.title')}
              </h2>
              <p className="mt-4 max-w-md text-lg text-brand-100">
                {t('home.becomeTutorCta.subtitle')}
              </p>
              <ul className="mt-6 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 text-white"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20">
                      <Check className="h-4 w-4" />
                    </span>
                    {t(`home.becomeTutorCta.benefits.${benefit}`)}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={paths.becomeTutor}
                  className={buttonVariants({ variant: 'white', size: 'lg' })}
                >
                  {t('home.becomeTutorCta.cta')}
                </Link>
                <a
                  href="#how-it-works"
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'lg',
                    className: 'text-white hover:bg-white/10',
                  })}
                >
                  {t('home.becomeTutorCta.howItWorks')}
                </a>
              </div>
            </div>

            <div className="relative mx-auto hidden max-w-sm lg:block">
              <img
                src="https://i.pravatar.cc/500?img=15"
                alt=""
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
              />
              <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 shadow-xl">
                <p className="text-sm text-gray-500">
                  {t('home.becomeTutorCta.earnedThisWeek')}
                </p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {t('home.becomeTutorCta.earnedAmount')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
