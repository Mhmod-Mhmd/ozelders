/** A learner testimonial shown on the marketing home page. */
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatarUrl: string;
  rating: number;
  quote: string;
}
