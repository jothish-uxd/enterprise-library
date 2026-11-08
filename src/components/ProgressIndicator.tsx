import { useId, type ReactNode } from 'react';

/**
 * ProgressIndicator (was ProgressCircle) — a ring that fills as a task goes, or spins while it waits:
 * the round, compact form of the progress bar, for a button, a table cell, a
 * card or a page that's loading.
 *
 * - With a `value`, the ring fills clockwise from the top. At 'lg' the value
 *   sits inside it.
 * - Without one, it's a spinner: an ink arc goes round the track. With reduced
 *   motion it stops, and the track is dashed instead.
 * - role="progressbar", always named by `label` ("Loading results"), shown
 *   beside or below the ring or kept for screen readers only. `valueText`
 *   says the value in words, else the percent.
 * - Not a live region and not focusable. Mark the area that's loading with
 *   aria-busy, and announce when it's done if it took a while.
 * - size 'sm' (16px, inline with text), 'md' (32px), 'lg' (64px).
 */
export interface ProgressIndicatorProps {
  /** Says what's happening: "Loading results" */
  label: ReactNode;
  /** Leave out to spin: it can't be measured */
  value?: number;
  max?: number;
  /** The value in words, e.g. "3 of 12" */
  valueText?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Where the label shows; 'hidden' keeps it for screen readers */
  labelPosition?: 'end' | 'below' | 'hidden';
  className?: string;
}

const R = 15.9155; // circumference 100

export function ProgressIndicator({
  label, value, max = 100, valueText, size = 'md', labelPosition = 'end', className = '',
}: ProgressIndicatorProps) {
  const id = useId();
  const known = typeof value === 'number' && Number.isFinite(value);
  const clamped = known ? Math.min(Math.max(value!, 0), max) : 0;
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  const text = known ? (valueText ?? `${Math.round(pct)}%`) : undefined;
  const cls = ['progress-indicator', `progress-indicator--${size}`, `progress-indicator--label-${labelPosition}`,
    !known && 'progress-indicator--spin', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div
        className="progress-indicator__ring"
        role="progressbar"
        aria-labelledby={`${id}-l`}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? max : undefined}
        aria-valuenow={known ? clamped : undefined}
        aria-valuetext={text}
      >
        <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
          <circle className="progress-indicator__track" cx="18" cy="18" r={R} />
          <circle className="progress-indicator__fill" cx="18" cy="18" r={R} pathLength={100}
            strokeDasharray={known ? `${pct} 100` : '25 100'} />
        </svg>
        {known && size === 'lg' && <span className="progress-indicator__value" aria-hidden="true">{text}</span>}
      </div>
      <span id={`${id}-l`} className={labelPosition === 'hidden' ? 'visually-hidden' : 'progress-indicator__label'}>
        {label}
        {known && size !== 'lg' && labelPosition !== 'hidden' && <span className="progress-indicator__inline-value" aria-hidden="true">{text}</span>}
      </span>
    </div>
  );
}
