import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import {
  type Availability,
  type AvailabilityPeriod,
  type Weekday,
} from '../types/tutor.types';

const DAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ROWS: { period: AvailabilityPeriod; time: string }[] = [
  { period: 'morning', time: '6–12' },
  { period: 'afternoon', time: '12–17' },
  { period: 'evening', time: '17–21' },
  { period: 'night', time: '21–24' },
];

export function AvailabilityCalendar({
  availability,
}: {
  availability: Availability;
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center">
        <thead>
          <tr>
            <th className="w-24" />
            {DAYS.map((day) => (
              <th
                key={day}
                className="pb-2 text-xs font-semibold text-gray-500"
              >
                {t(`weekdays.${day}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.period}>
              <td className="py-1 pr-3 text-left align-middle">
                <p className="text-xs font-semibold text-gray-700">
                  {t(`tutors.periods.${row.period}`)}
                </p>
                <p className="text-[11px] text-gray-400">{row.time}</p>
              </td>
              {DAYS.map((day) => {
                const available = availability[day].includes(row.period);
                return (
                  <td key={day}>
                    <div
                      className={cn(
                        'h-9 rounded-md',
                        available
                          ? 'bg-brand-100 ring-1 ring-brand-200'
                          : 'bg-gray-50 ring-1 ring-gray-100',
                      )}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand-100 ring-1 ring-brand-200" />
          {t('tutors.available')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gray-50 ring-1 ring-gray-200" />
          {t('tutors.unavailable')}
        </span>
      </div>
    </div>
  );
}
