import { useEffect, useState } from 'react';

/**
 * Tracks whether the window is scrolled vertically past `threshold` pixels.
 * Returns `false` when disabled. Used to hide the header / pin the filter bar
 * once the user scrolls down the page.
 */
export function useScrolledPast(threshold = 80, enabled = true): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setPast(false);
      return;
    }

    const update = () => setPast(window.scrollY > threshold);
    update(); // sync on mount / when re-enabled
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold, enabled]);

  return past;
}
