import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { Container } from '@/components/ui/Container';

/**
 * Placeholder for the student's lessons. Content and design are wired up later;
 * for now it renders the page shell so the route and navigation work.
 */
export function StudentLessonsPage() {
  const { t } = useTranslation();

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {t('lessons.title')}
      </h1>
      <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
        <CalendarDays className="h-10 w-10 text-gray-300" />
        <p className="mt-4 text-gray-500">{t('lessons.comingSoon')}</p>
      </div>
    </Container>
  );
}
