import { useId, type ReactNode } from 'react';

/**
 * Loader (was ProgressIndicator, ProgressCircle) — a small mark that shows
 * something is loading or working, and how far it's got when that can be
 * measured. For a wide, thin bar use ProgressBar; for grey shapes where
 * content will appear use Skeleton.
 *
 * Seven types, all the same square size:
 * - circle  a ring that fills with a value, or spins without one (default)
 * - ticks   twelve ticks round a circle: they light up with a value, or turn
 * - dots    three dots that pulse in turn
 * - bars    four bars that rise and fall
 * - orbit   a dot that goes round a ring
 * - pulse   a dot with a ring that grows from it and fades
 * - grid    nine squares that light up in a wave
 * Only circle and ticks can show a value.
 *
 * - role="progressbar", always named by `label` ("Loading results"), shown
 *   beside or below, or kept for screen readers only. With a value it has
 *   aria-valuenow/-min/-max and `valueText` ("8 of 12").
 * - Not a live region and not focusable. Mark the area that's loading with
 *   aria-busy, and announce when it's done if it took a while.
 * - Reduced motion: nothing moves. The circle and orbit go dashed; the others
 *   hold a still fade, so each still reads as waiting.
 * - size 'sm' (16px, inline with text), 'md' (32px), 'lg' (64px; circle and
 *   ticks show the value inside).
 */
export type LoaderType = 'circle' | 'ticks' | 'dots' | 'bars' | 'orbit' | 'pulse' | 'grid';

export interface LoaderProps {
  type?: LoaderType;
  /** Says what's happening: "Loading results" */
  label: ReactNode;
  /** Circle and ticks only. Leave out while it can't be measured. */
  value?: number;
  max?: number;
  /** The value in words, e.g. "8 of 12" */
  valueText?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Where the label shows; 'hidden' keeps it for screen readers */
  labelPosition?: 'end' | 'below' | 'hidden';
  className?: string;
}

const R = 15.9155; // circumference 100
const TICKS = 12;
const MEASURABLE: LoaderType[] = ['circle', 'ticks'];
const SVG = { viewBox: '0 0 36 36', 'aria-hidden': true, focusable: false } as const;

function Mark({ type, known, pct }: { type: LoaderType; known: boolean; pct: number }) {
  switch (type) {
    case 'ticks': {
      const lit = Math.round((pct / 100) * TICKS);
      return (
        <svg {...SVG}>
          {Array.from({ length: TICKS }, (_, i) => (
            <line key={i} x1="18" y1="2.5" x2="18" y2="8.5" transform={`rotate(${i * 30} 18 18)`}
              className={known ? (i < lit ? 'loader__tick is-on' : 'loader__tick') : `loader__tick loader__tick--${i}`} />
          ))}
        </svg>
      );
    }
    case 'dots':
      return <span className="loader__row">{[0, 1, 2].map((i) => <span key={i} className="loader__dot" />)}</span>;
    case 'bars':
      return <span className="loader__row">{[0, 1, 2, 3].map((i) => <span key={i} className="loader__bar" />)}</span>;
    case 'orbit':
      return (
        <svg {...SVG}>
          <circle className="loader__track" cx="18" cy="18" r="13" />
          <g className="loader__orbit"><circle className="loader__moon" cx="18" cy="5" r="3.5" /></g>
        </svg>
      );
    case 'pulse':
      return (
        <svg {...SVG}>
          <circle className="loader__wave" cx="18" cy="18" r="6" />
          <circle className="loader__core" cx="18" cy="18" r="6" />
        </svg>
      );
    case 'grid':
      return <span className="loader__grid">{Array.from({ length: 9 }, (_, i) => <span key={i} className={`loader__cell loader__cell--${(i % 3) + Math.floor(i / 3)}`} />)}</span>;
    default:
      return (
        <svg {...SVG}>
          <circle className="loader__track" cx="18" cy="18" r={R} />
          <circle className="loader__fill" cx="18" cy="18" r={R} pathLength={100} strokeDasharray={known ? `${pct} 100` : '25 100'} />
        </svg>
      );
  }
}

export function Loader({
  type = 'circle', label, value, max = 100, valueText, size = 'md', labelPosition = 'end', className = '',
}: LoaderProps) {
  const id = useId();
  const known = MEASURABLE.includes(type) && typeof value === 'number' && Number.isFinite(value);
  const clamped = known ? Math.min(Math.max(value!, 0), max) : 0;
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  const text = known ? (valueText ?? `${Math.round(pct)}%`) : undefined;
  const inside = known && size === 'lg';
  const cls = ['loader', `loader--${type}`, `loader--${size}`, `loader--label-${labelPosition}`, !known && 'loader--waiting', className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div
        className="loader__mark"
        role="progressbar"
        aria-labelledby={`${id}-l`}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? max : undefined}
        aria-valuenow={known ? clamped : undefined}
        aria-valuetext={text}
      >
        <Mark type={type} known={known} pct={pct} />
        {inside && <span className="loader__value" aria-hidden="true">{text}</span>}
      </div>
      <span id={`${id}-l`} className={labelPosition === 'hidden' ? 'visually-hidden' : 'loader__label'}>
        {label}
        {known && !inside && labelPosition !== 'hidden' && <span className="loader__inline-value" aria-hidden="true">{text}</span>}
      </span>
    </div>
  );
}
