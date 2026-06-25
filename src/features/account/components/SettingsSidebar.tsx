import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { SETTINGS_SECTIONS, type SettingsSection } from '../utils/sections';

interface SettingsSidebarProps {
  active: SettingsSection;
  onSelect: (section: SettingsSection) => void;
}

/**
 * Section navigation for the settings page. Renders as a left rail on `lg`+ and
 * a horizontally scrollable tab strip on smaller screens.
 */
export function SettingsSidebar({ active, onSelect }: SettingsSidebarProps) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('settings.sectionsLabel')}
      className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0 lg:flex-col lg:gap-0.5"
    >
      {SETTINGS_SECTIONS.map((section) => {
        const isActive = section === active;
        const isDanger = section === 'deleteAccount';
        return (
          <button
            key={section}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelect(section)}
            className={cn(
              'relative shrink-0 rounded-lg px-3 py-2 text-start text-sm font-medium whitespace-nowrap transition-colors lg:shrink',
              isActive
                ? 'bg-brand-50 font-semibold text-brand-700'
                : isDanger
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            {isActive && (
              <span className="absolute inset-y-1.5 start-0 hidden w-0.5 rounded-full bg-brand-500 lg:block" />
            )}
            {t(`settings.sections.${section}`)}
          </button>
        );
      })}
    </nav>
  );
}
