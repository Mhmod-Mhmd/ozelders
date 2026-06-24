import { Search, CalendarCheck, GraduationCap } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STEPS = [
  {
    icon: Search,
    title: 'Find your tutor',
    text: 'Browse expert tutors and filter by price, subject and availability to find your perfect match.',
  },
  {
    icon: CalendarCheck,
    title: 'Book a trial',
    text: 'Schedule a trial lesson at a time that suits you. Not the right fit? Switch tutors for free, anytime.',
  },
  {
    icon: GraduationCap,
    title: 'Start learning',
    text: 'Join interactive 1-on-1 video lessons and make real, measurable progress every single week.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Start learning in 3 simple steps"
          subtitle="From sign-up to your first lesson in just a few minutes."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-card"
            >
              <span className="absolute top-6 right-6 text-5xl font-extrabold text-gray-100">
                {i + 1}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <step.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
