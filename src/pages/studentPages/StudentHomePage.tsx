import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  ChevronDown,
  Globe,
  Heart,
  Play,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { paths } from '@/router/paths';
import { TUTORS } from '@/data';
import { type Tutor } from '@/features/tutors/types/tutor.types';

/**
 * Student landing page shown right after login: a Preply-style tutor discovery
 * view with a filter bar, a list of tutor cards, and a promo/video rail.
 */

/** Believable per-lesson price in Turkish lira derived from the USD hourly rate. */
const LIRA_PER_USD = 46;

function formatLira(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

function lessonPrice(tutor: Tutor): number {
  return Math.round(tutor.pricePerHour * LIRA_PER_USD);
}

/* -------------------------------------------------------------------------- */
/* Filter bar                                                                 */
/* -------------------------------------------------------------------------- */

interface FilterFieldProps {
  label: string;
  value: string;
  /** Show a clear (×) affordance like the active filters in the design. */
  clearable?: boolean;
}

/** Large labelled dropdown control (top row of the filter bar). */
function FilterField({ label, value, clearable }: FilterFieldProps) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left transition-colors hover:border-gray-300"
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium text-gray-500">{label}</span>
        <span className="block truncate text-sm font-semibold text-gray-900">
          {value}
        </span>
      </span>
      {clearable ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-900 text-white">
          <X className="h-3.5 w-3.5" />
        </span>
      ) : (
        <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
      )}
    </button>
  );
}

interface FilterPillProps {
  label: string;
  /** Numeric badge (count of active sub-filters). */
  count?: number;
  /** Render a check badge instead of a chevron (toggle is on). */
  checked?: boolean;
}

/** Compact pill control (second row of the filter bar). */
function FilterPill({ label, count, checked }: FilterPillProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-300"
    >
      {label}
      {count !== undefined && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gray-900 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
      {checked ? (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-white">
          <BadgeCheck className="h-3.5 w-3.5" />
        </span>
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Tutor card                                                                 */
/* -------------------------------------------------------------------------- */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-base font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function StudentTutorCard({ tutor }: { tutor: Tutor }) {
  const profile = paths.tutorProfile(tutor.id);
  const speaks = tutor.speaks
    .map((s) => `${s.language} (${s.level})`)
    .join(', ');

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Avatar */}
        <Link
          to={profile}
          className="mx-auto shrink-0 sm:mx-0"
          aria-label={`View ${tutor.name}'s profile`}
        >
          <Avatar
            src={tutor.avatarUrl}
            alt={tutor.name}
            size={128}
            className="h-32 w-32 rounded-2xl"
          />
        </Link>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link
                  to={profile}
                  className="text-lg font-bold text-gray-900 hover:text-brand-600"
                >
                  {tutor.name}
                </Link>
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-500" />
                <span aria-hidden className="text-lg leading-none">
                  {tutor.countryFlag}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {tutor.superTutor && (
                  <Badge variant="brand">
                    <BadgeCheck className="h-3.5 w-3.5" /> Super Tutor
                  </Badge>
                )}
                <Badge variant="neutral">Professional</Badge>
              </div>

              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Globe className="h-4 w-4 text-gray-400" />
                {tutor.subject}
              </p>
              <p className="mt-1 text-sm text-gray-500">Speaks {speaks}</p>
            </div>

            <button
              type="button"
              aria-label="Save tutor"
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-rose-500"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{tutor.headline}</span>
            {' — '}
            <span className="text-gray-600">{tutor.bio}</span>
          </p>
          <Link
            to={profile}
            className="mt-1 inline-block text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-600"
          >
            Learn more
          </Link>
        </div>

        {/* Price + actions */}
        <div className="flex shrink-0 flex-col items-stretch gap-4 border-t border-gray-100 pt-4 sm:w-52 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
          <div className="text-center sm:text-left">
            <p className="text-2xl font-extrabold text-gray-900">
              {formatLira(lessonPrice(tutor))}
            </p>
            <p className="text-xs text-gray-500">50-min lesson</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Stat
              value={tutor.rating.toFixed(1)}
              label={`${tutor.reviewsCount} reviews`}
            />
            <Stat value={String(tutor.studentsCount)} label="students" />
            <Stat
              value={tutor.lessonsCount.toLocaleString()}
              label="lessons"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Link to={profile} className={buttonVariants({ size: 'md' })}>
              Book trial lesson
            </Link>
            <Link
              to={profile}
              className={buttonVariants({ variant: 'outline', size: 'md' })}
            >
              Send message
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Promo / video rail                                                         */
/* -------------------------------------------------------------------------- */

function VideoPromoCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
      <div className="relative aspect-video bg-linear-to-br from-brand-500 to-brand-700">
        <img
          src={tutor.avatarUrl}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <p className="absolute top-3 left-4 max-w-[70%] text-lg font-extrabold tracking-tight text-white drop-shadow">
          Let&apos;s Talk {tutor.subject}!
        </p>
        <button
          type="button"
          aria-label="Play intro video"
          className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-white shadow-lg transition-transform hover:scale-105"
        >
          <Play className="h-5 w-5 translate-x-0.5 fill-current" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900">{tutor.name}</p>
        <p className="mt-0.5 text-xs text-gray-500">{tutor.headline}</p>
        <Link
          to={paths.tutorProfile(tutor.id)}
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className: 'mt-3 w-full',
          })}
        >
          View full schedule
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

const SORT_OPTIONS = [
  'Our top picks',
  'Price: low to high',
  'Price: high to low',
  'Most reviews',
] as const;

export function StudentHomePage() {
  const [search, setSearch] = useState('');

  const tutors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TUTORS;
    return TUTORS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.headline.toLowerCase().includes(q),
    );
  }, [search]);

  const featured = tutors[0];

  return (
    <div className="bg-gray-50">
      {/* Filter bar */}
      <div className="border-b border-gray-100 bg-white">
        <Container className="px-3.75 py-5 sm:px-3.75 lg:px-3.75">
          {/* Top row: labelled dropdowns */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="I want to learn" value="English" />
            <FilterField
              label="Price per lesson"
              value="₺100 – ₺1,600"
              clearable
            />
            <FilterField
              label="Country of birth"
              value="United States of America"
              clearable
            />
            <FilterField
              label="I'm available"
              value="12-15, 15-18 · Wed"
              clearable
            />
          </div>

          {/* Second row: pills + search */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <FilterPill label="Specialties" count={1} />
            <FilterPill label="Also speaks" count={2} />
            <FilterPill label="Native speaker" checked />
            <FilterPill label="Tutor categories" />

            <label className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800">
              <span className="text-gray-500">Sort tutors by</span>
              <select className="cursor-pointer appearance-none bg-transparent font-semibold text-gray-900 focus:outline-none">
                {SORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </label>

            <div className="relative ml-auto w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or keyword"
                className="w-full rounded-full border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-800 hover:border-gray-300 focus-visible:border-brand-400"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Heading */}
      <Container className="px-3.75 pt-8 pb-2 sm:px-3.75 lg:px-3.75">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            English tutors that help you develop professionally
          </h1>
          <span aria-hidden className="hidden text-4xl sm:block">
            📈
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{tutors.length}</span>{' '}
          {tutors.length === 1 ? 'tutor' : 'tutors'} available
        </p>
      </Container>

      {/* Results + rail */}
      <Container className="px-3.75 py-6 sm:px-3.75 lg:px-3.75">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="space-y-5">
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <StudentTutorCard key={tutor.id} tutor={tutor} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <Search className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  No tutors match “{search}”
                </h3>
                <p className="mt-1 text-gray-500">
                  Try a different name or keyword.
                </p>
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="mt-6 hidden lg:mt-0 lg:block">
            {featured && (
              <div className="sticky top-20">
                <VideoPromoCard tutor={featured} />
              </div>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
