import { Link } from 'react-router-dom';
import { Star, BadgeCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { paths } from '@/router/paths';
import { SearchBar } from './SearchBar';

const POPULAR = [
  { label: 'English', category: 'languages' },
  { label: 'Mathematics', category: 'mathematics' },
  { label: 'Programming', category: 'programming' },
  { label: 'Music', category: 'music' },
];

const HERO_IMAGES = [
  { img: 1, ratio: 'aspect-[3/4]' },
  { img: 5, ratio: 'aspect-square' },
  { img: 12, ratio: 'aspect-square' },
  { img: 8, ratio: 'aspect-[3/4]' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <Container className="pt-7.5 pb-12 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy + search */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-100">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              4.9 average from 300,000+ reviews
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Learn faster with your{' '}
              <span className="text-brand-600">perfect tutor</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-gray-600">
              1-on-1 online lessons in languages, math, science, music and 120+
              subjects. Find an expert tutor, book a trial, and start making
              progress every week.
            </p>

            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Popular:</span>
              {POPULAR.map((item) => (
                <Link
                  key={item.label}
                  to={`${paths.tutors}?category=${item.category}`}
                  className="rounded-full bg-white px-3 py-1 font-medium text-gray-700 shadow-sm ring-1 ring-gray-100 transition-colors hover:text-brand-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { value: '50,000+', label: 'Expert tutors' },
                { value: '120+', label: 'Subjects' },
                { value: '4.9★', label: 'Avg. rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-extrabold text-gray-900">
                    {stat.value}
                  </dt>
                  <dd className="text-sm text-gray-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual collage */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-10">
                {HERO_IMAGES.slice(0, 2).map(({ img, ratio }) => (
                  <img
                    key={img}
                    src={`https://i.pravatar.cc/400?img=${img}`}
                    alt=""
                    className={`w-full rounded-3xl object-cover shadow-card ${ratio}`}
                  />
                ))}
              </div>
              <div className="space-y-4">
                {HERO_IMAGES.slice(2).map(({ img, ratio }) => (
                  <img
                    key={img}
                    src={`https://i.pravatar.cc/400?img=${img}`}
                    alt=""
                    className={`w-full rounded-3xl object-cover shadow-card ${ratio}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating rating chip */}
            <div className="absolute -top-4 -left-6 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-gray-100">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">Top-rated</p>
                <p className="text-xs text-gray-500">tutors worldwide</p>
              </div>
            </div>

            {/* Floating booking chip */}
            <div className="absolute -right-5 -bottom-5 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-gray-100">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50">
                <BadgeCheck className="h-5 w-5 text-green-600" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">1,200+ trials</p>
                <p className="text-xs text-gray-500">booked today</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
