import { useTranslation } from 'react-i18next';
import { Search, CalendarCheck, GraduationCap } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STEPS = [
  { icon: Search, key: 'find' },
  { icon: CalendarCheck, key: 'book' },
  { icon: GraduationCap, key: 'learn' },
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={t('home.howItWorks.eyebrow')}
          title={t('home.howItWorks.title')}
          subtitle={t('home.howItWorks.subtitle')}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-card"
            >
              <span className="absolute top-6 right-6 text-5xl font-extrabold text-gray-100">
                {i + 1}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <step.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {t(`home.howItWorks.steps.${step.key}.title`)}
              </h3>
              <p className="mt-2 text-gray-600">
                {t(`home.howItWorks.steps.${step.key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
