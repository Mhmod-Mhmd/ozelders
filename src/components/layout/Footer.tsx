import { Link } from 'react-router-dom';
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
  label: string;
  to: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
      { label: 'Blog', to: '#' },
    ],
  },
  {
    title: 'For students',
    links: [
      { label: 'Find a tutor', to: paths.tutors },
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Pricing', to: '#' },
      { label: 'Reviews', to: '#' },
    ],
  },
  {
    title: 'For tutors',
    links: [
      { label: 'Become a tutor', to: paths.becomeTutor },
      { label: 'Tutor resources', to: '#' },
      { label: 'Community', to: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', to: '#' },
      { label: 'Contact us', to: '#' },
      { label: 'Safety', to: '#' },
      { label: 'Terms', to: '#' },
    ],
  },
];

const SOCIALS = [
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'YouTube', icon: YoutubeIcon },
  { label: 'LinkedIn', icon: LinkedinIcon },
  { label: 'X', icon: XIcon },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const isRoute = link.to.startsWith('/') && !link.to.startsWith('/#');
  const className =
    'text-sm text-gray-600 transition-colors hover:text-brand-600';
  return isRoute ? (
    <Link to={link.to} className={className}>
      {link.label}
    </Link>
  ) : (
    <a href={link.to} className={className}>
      {link.label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-gray-600">
              Learn anything, 1-on-1, with the world’s best online tutors.
              Languages, math, science, music and more.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-gray-600 shadow-sm transition-colors hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © 2012–2026 Ozelders Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-brand-600">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-brand-600">
              Cookies
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-brand-600">
              Terms
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
