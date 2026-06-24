export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatarUrl: string;
  rating: number;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'ts1',
    author: 'Jessica Moore',
    role: 'Learning Spanish',
    avatarUrl: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    quote:
      'I went from barely ordering coffee to holding full conversations in three months. My tutor made every lesson feel like chatting with a friend.',
  },
  {
    id: 'ts2',
    author: 'Tom Andersson',
    role: 'IELTS preparation',
    avatarUrl: 'https://i.pravatar.cc/150?img=51',
    rating: 5,
    quote:
      'Scored an 8.0 on my IELTS thanks to the structured practice and honest feedback. I couldn’t have done it without Ozelders.',
  },
  {
    id: 'ts3',
    author: 'Amara Okafor',
    role: 'Learning to code',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    quote:
      'My programming tutor helped me build real projects and pass two interviews. I just accepted my first developer job offer!',
  },
  {
    id: 'ts4',
    author: 'Kenji Watanabe',
    role: 'Business English',
    avatarUrl: 'https://i.pravatar.cc/150?img=53',
    rating: 5,
    quote:
      'Presenting to international clients used to terrify me. Now I lead meetings in English with confidence. Highly recommended.',
  },
  {
    id: 'ts5',
    author: 'Léa Bernard',
    role: 'Math & exam prep',
    avatarUrl: 'https://i.pravatar.cc/150?img=49',
    rating: 5,
    quote:
      'Calculus finally makes sense! My tutor is patient and explains things in a way my school never could. My grades jumped a full letter.',
  },
  {
    id: 'ts6',
    author: 'Marcus Bauer',
    role: 'Learning guitar',
    avatarUrl: 'https://i.pravatar.cc/150?img=59',
    rating: 5,
    quote:
      'I’m playing songs I love after just two months. The lessons are relaxed, fun, and perfectly paced for a total beginner like me.',
  },
];
