import { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface QrPlaceholderProps {
  /** Pixels — the QR is square. */
  size?: number;
  className?: string;
}

const MODULES = 25; // grid resolution

/** True where the three position-detection (finder) squares sit. */
function isFinder(row: number, col: number): boolean {
  const inBox = (r0: number, c0: number) =>
    row >= r0 && row < r0 + 7 && col >= c0 && col < c0 + 7;
  const corners = inBox(0, 0) || inBox(0, MODULES - 7) || inBox(MODULES - 7, 0);
  if (!corners) return false;
  const r = row >= MODULES - 7 ? row - (MODULES - 7) : row;
  const c = col >= MODULES - 7 ? col - (MODULES - 7) : col;
  // Ring of the finder pattern (border + filled centre), hollow mid-band.
  return (
    r === 0 ||
    r === 6 ||
    c === 0 ||
    c === 6 ||
    (r >= 2 && r <= 4 && c >= 2 && c <= 4)
  );
}

/**
 * Decorative, deterministic QR-style graphic used as a stand-in for the real
 * device-settings deep link. Purely presentational — it doesn't encode data.
 */
export function QrPlaceholder({ size = 168, className }: QrPlaceholderProps) {
  const cells = useMemo(() => {
    const out: boolean[] = [];
    for (let row = 0; row < MODULES; row++) {
      for (let col = 0; col < MODULES; col++) {
        if (isFinder(row, col)) {
          out.push(true);
        } else if (
          (row < 8 && col < 8) ||
          (row < 8 && col > MODULES - 9) ||
          (row > MODULES - 9 && col < 8)
        ) {
          out.push(false); // quiet zone around finders
        } else {
          // Fixed pseudo-pattern — no randomness, stable across renders.
          out.push((row * 7 + col * 13 + ((row * col) % 5)) % 3 === 0);
        }
      }
    }
    return out;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${MODULES} ${MODULES}`}
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={cn('rounded-lg bg-white', className)}
    >
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % MODULES}
            y={Math.floor(i / MODULES)}
            width={1}
            height={1}
            className="fill-gray-900"
          />
        ) : null,
      )}
    </svg>
  );
}
