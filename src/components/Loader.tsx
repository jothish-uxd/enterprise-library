import { useId, type ReactNode } from 'react';

/**
 * Loader (was ProgressIndicator, ProgressCircle) — shows that something is
 * loading or working, and how far it's got when that can be measured.
 *
 * Five types:
 * - circle    a ring that fills with a value, or spins without one
 * - ticks     twelve ticks round a circle: they light up with a value, or turn
 * - line      a thin full-width line: it fills, or a band slides along it
 * - dots      three dots that pulse in turn; never measured
 * - skeleton  grey lines where content will appear; never measured
 *
 * - role="progressbar", always named by `label` ("Loading results"), shown
 *   beside or below, or kept for screen readers only (always, for skeleton).
 *   With a value it has aria-valuenow/-min/-max and `valueText` ("8 of 12").
 * - Not a live region and not focusable. Mark the area that's loading with
 *   aria-busy, and announce when it's done if it took a while.
 * - Reduced motion: nothing moves. Circle and line go dashed or hatched,
 *   ticks and dots hold a still fade, skeleton lines stay grey.
 * - size 'sm' (16px, inline with text), 'md' (32px), 'lg' (64px; circle and
 *   ticks show the value inside). Line and skeleton take the width they're given.
 */
export type LoaderType = 'circle' | 'ticks' | 'line' | 'dots' | 'skeleton';

export interface LoaderProps {
  type?: LoaderType;
  /** Says what's happening: "Loading results" */
  label: ReactNode;
  /** Circle, ticks and line only. Leave out while it can't be measured. */
  value?: number;
  max?: number;
  /** The value in words, e.g. "8 of 12" */
  valueText?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Where the label shows; 'hidden' keeps it for screen readers */
  labelPosition?: 'end' | 'below' | 'hidden';
  /** Skeleton: how many lines (default 3) */
  lines?: number;
  className?: string;
}

const R = 15.9155; // circumference 100
const TICKS = 12;
const MEASURABLE: LoaderType[] = ['circle', 'ticks', 'line'];

export function Loader({
  type = 'circle', label, value, max = 100, valueText, size = 'md', labelPosition = 'end', lines = 3, className = '',
}: LoaderProps) {
  const id = useId();
  const known = MEASURABLE.includes(type) && typeof value === 'number' && Number.isFinite(value);
  const clamped = known ? Math.min(Math.max(value!, 0), max) : 0;
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  const text = known ? (valueText ?? `${Math.round(pct)}%`) : undefined;
  const position = type === 'skeleton' ? 'hidden' : labelPosition;
  const inside = known && size === 'lg' && (type === 'circle' || type === 'ticks');
  const cls = ['loader', `loader--${type}`, `loader--${size}`, `loader--label-${position}`, !known && 'loader--waiting', className]
    .filter(Boolean).join(' ');

  let mark: ReactNode;
  if (type === 'circle') {
    mark = (
      <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
        <circle className="loader__track" cx="18" cy="18" r={R} />
        <circle className="loader__fill" cx="18" cy="18" r={R} pathLength={100} strokeDasharray={known ? `${pct} 100` : '25 100'} />
      </svg>
    );
  } else if (type === 'ticks') {
    const lit = Math.round((pct / 100) * TICKS);
    mark = (
      <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
        {Array.from({ length: TICKS }, (_, i) => (
          <line key={i} x1="18" y1="2.5" x2="18" y2="8.5" transform={`rotate(${i * 30} 18 18)`}
            className={known ? (i < lit ? 'loader__tick is-on' : 'loader__tick') : `loader__tick loader__tick--${i}`} />
        ))}
      </svg>
    );
  } else if (type === 'line') {
    mark = <span className="loader__fill" style={known ? { width: `${pct}%` } : undefined} />;
  } else if (type === 'dots') {
    mark = <><span className="loader__dot" /><span className="loader__dot" /><span className="loader__dot" /></>;
  } else {
    mark = Array.from({ length: Math.max(1, lines) }, (_, i) => <span key={i} className="loader__bone" />);
  }

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
        {mark}
        {inside && <span className="loader__value" aria-hidden="true">{text}</span>}
      </div>
      <span id={`${id}-l`} className={position === 'hidden' ? 'visually-hidden' : 'loader__label'}>
        {label}
        {known && !inside && position !== 'hidden' && <span className="loader__inline-value" aria-hidden="true">{text}</span>}
      </span>
    </div>
  );
}
