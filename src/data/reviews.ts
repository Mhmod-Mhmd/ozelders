import { type Review } from '@/features/tutors/types/tutor.types';

const AUTHORS = [
  { name: 'Michael B.', img: 31 },
  { name: 'Sarah L.', img: 32 },
  { name: 'James P.', img: 33 },
  { name: 'Olivia R.', img: 34 },
  { name: 'Daniel K.', img: 35 },
  { name: 'Chloe M.', img: 36 },
  { name: 'Ethan W.', img: 37 },
  { name: 'Isabella G.', img: 38 },
  { name: 'Lucas T.', img: 39 },
  { name: 'Mia H.', img: 40 },
];

const COMMENTS = [
  'Absolutely fantastic tutor! Lessons are well-structured and I’ve made huge progress in just a few weeks.',
  'So patient and encouraging. I finally feel confident speaking and actually look forward to every lesson.',
  'Explains everything clearly and adapts to my pace. Highly recommend to anyone starting out.',
  'Best decision I made this year. Friendly, professional, and always prepared with great materials.',
  'My tutor makes learning genuinely fun. The lessons fly by and I leave each one motivated.',
  'Incredibly knowledgeable and great at breaking down difficult topics. Worth every penny.',
  'Super flexible with scheduling and always responsive. I’ve improved more than I expected.',
  'Warm, supportive, and engaging. Tailors each lesson to exactly what I need to work on.',
];

const RELATIVE_DATES = [
  '3 days ago',
  '1 week ago',
  '2 weeks ago',
  '3 weeks ago',
  '1 month ago',
  '2 months ago',
];

/** Stable string hash so generated reviews stay consistent across renders. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Deterministically build a set of reviews for a tutor. */
export function getReviewsForTutor(tutorId: string, count = 5): Review[] {
  const seed = hash(tutorId);
  return Array.from({ length: count }, (_, i) => {
    const author = AUTHORS[(seed + i * 3) % AUTHORS.length];
    return {
      id: `${tutorId}-r${i + 1}`,
      tutorId,
      author: author.name,
      authorAvatarUrl: `https://i.pravatar.cc/150?img=${author.img}`,
      rating: (seed + i) % 5 === 0 ? 4 : 5,
      date: RELATIVE_DATES[(seed + i * 2) % RELATIVE_DATES.length],
      comment: COMMENTS[(seed + i * 5) % COMMENTS.length],
    };
  });
}
