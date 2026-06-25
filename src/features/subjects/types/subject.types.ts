import { type LucideIcon } from 'lucide-react';

/** A subject category shown in the catalog / filters. */
export interface Subject {
  key: string;
  name: string;
  /**
   * Presentational icon. Lives on the model for convenience in this mock-only
   * app; a real API would return an icon key the UI maps to a component.
   */
  icon: LucideIcon;
  tutorsCount: number;
  blurb: string;
  /** Tailwind classes for the icon chip background + text color. */
  accent: string;
}
