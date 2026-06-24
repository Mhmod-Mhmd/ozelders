import {
  Languages,
  Calculator,
  FlaskConical,
  Music,
  Code2,
  Briefcase,
  GraduationCap,
  Palette,
  Landmark,
  Dumbbell,
  type LucideIcon,
} from 'lucide-react';

export interface Subject {
  key: string;
  name: string;
  icon: LucideIcon;
  tutorsCount: number;
  blurb: string;
  /** Tailwind classes for the icon chip background + text color. */
  accent: string;
}

export const SUBJECTS: Subject[] = [
  {
    key: 'languages',
    name: 'Languages',
    icon: Languages,
    tutorsCount: 33602,
    blurb: 'English, Spanish, French, German & 40+ more',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    tutorsCount: 8120,
    blurb: 'Algebra, Calculus, Statistics & exam prep',
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    key: 'science',
    name: 'Science',
    icon: FlaskConical,
    tutorsCount: 5430,
    blurb: 'Physics, Chemistry, Biology & more',
    accent: 'bg-cyan-50 text-cyan-600',
  },
  {
    key: 'music',
    name: 'Music',
    icon: Music,
    tutorsCount: 4210,
    blurb: 'Guitar, Piano, Vocals & music theory',
    accent: 'bg-pink-50 text-pink-600',
  },
  {
    key: 'programming',
    name: 'Programming',
    icon: Code2,
    tutorsCount: 6890,
    blurb: 'Python, JavaScript, web & interview prep',
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    key: 'business',
    name: 'Business',
    icon: Briefcase,
    tutorsCount: 3120,
    blurb: 'Strategy, finance, marketing & soft skills',
    accent: 'bg-amber-50 text-amber-600',
  },
  {
    key: 'test-prep',
    name: 'Test Prep',
    icon: GraduationCap,
    tutorsCount: 7450,
    blurb: 'IELTS, TOEFL, SAT, GMAT & more',
    accent: 'bg-rose-50 text-rose-600',
  },
  {
    key: 'art-design',
    name: 'Art & Design',
    icon: Palette,
    tutorsCount: 2980,
    blurb: 'Drawing, painting, UI/UX & illustration',
    accent: 'bg-fuchsia-50 text-fuchsia-600',
  },
  {
    key: 'history',
    name: 'History',
    icon: Landmark,
    tutorsCount: 1870,
    blurb: 'World history, politics & social studies',
    accent: 'bg-orange-50 text-orange-600',
  },
  {
    key: 'sports',
    name: 'Sports & Fitness',
    icon: Dumbbell,
    tutorsCount: 1340,
    blurb: 'Coaching, nutrition & training plans',
    accent: 'bg-green-50 text-green-600',
  },
];

export function getSubjectByKey(key: string): Subject | undefined {
  return SUBJECTS.find((s) => s.key === key);
}
