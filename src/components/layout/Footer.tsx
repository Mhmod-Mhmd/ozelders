import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { paths } from '@/router/paths';
import { Logo } from './Logo';
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  XIcon,
} from './SocialIcons';

interface FooterLink {
  /** i18n key for the link label. */
  labelKey: string;
  to: string;
}

interface FooterColumn {
  /** i18n key for the column title. */
  titleKey: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    titleKey: 'footer.company.title',
    links: [
      { labelKey: 'footer.company.about', to: '#' },
      { labelKey: 'footer.company.careers', to: '#' },
      { labelKey: 'footer.company.press', to: '#' },
      { labelKey: 'footer.company.blog', to: '#' },
    ],
  },
  {
    titleKey: 'footer.students.title',
    links: [
      { labelKey: 'footer.students.findTutor', to: paths.tutors },
      { labelKey: 'footer.students.howItWorks', to: '/#how-it-works' },
      { labelKey: 'footer.students.pricing', to: '#' },
      { labelKey: 'footer.students.reviews', to: '#' },
    ],
  },
  {
    titleKey: 'footer.tutors.title',
    links: [
      { labelKey: 'footer.tutors.become', to: paths.becomeTutor },
      { labelKey: 'footer.tutors.resources', to: '#' },
      { labelKey: 'footer.tutors.community', to: '#' },
    ],
  },
  {
    titleKey: 'footer.support.title',
    links: [
      { labelKey: 'footer.support.help', to: '#' },
      { labelKey: 'footer.support.contact', to: '#' },
      { labelKey: 'footer.support.safety', to: '#' },
      { labelKey: 'footer.support.terms', to: '#' },
    ],
  },
];

const SOCIALS = [
  { id: 'facebook', labelKey: 'footer.social.facebook', icon: FacebookIcon },
  { id: 'instagram', labelKey: 'footer.social.instagram', icon: InstagramIcon },
  { id: 'youtube', labelKey: 'footer.social.youtube', icon: YoutubeIcon },
  { id: 'linkedin', labelKey: 'footer.social.linkedin', icon: LinkedinIcon },
  { id: 'x', labelKey: 'footer.social.x', icon: XIcon },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const { t } = useTranslation();
  const isRoute = link.to.startsWith('/') && !link.to.startsWith('/#');
  const className =
    'text-sm text-gray-600 transition-colors hover:text-brand-600';
  return isRoute ? (
    <Link to={link.to} className={className}>
      {t(link.labelKey)}
    </Link>
  ) : (
    <a href={link.to} className={className}>
      {t(link.labelKey)}
    </a>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-gray-600">
              {t('footer.tagline')}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ id, labelKey, icon: Icon }) => (
                <a
                  key={id}
                  href="#"
                  aria-label={t(labelKey)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-gray-600 shadow-sm transition-colors hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <div key={column.titleKey}>
              <h3 className="text-sm font-semibold text-gray-900">
                {t(column.titleKey)}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.labelKey}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">{t('footer.copyright')}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-brand-600">
              {t('footer.legal.privacy')}
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-brand-600">
              {t('footer.legal.cookies')}
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-brand-600">
              {t('footer.legal.terms')}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
