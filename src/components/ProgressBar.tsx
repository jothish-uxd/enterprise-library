import { useId, type ReactNode } from 'react';
import { AlertIcon } from './AlertIcon';

/**
 * ProgressBar — how far a task has got, when it takes a few seconds or more:
 * uploads, scoring, training. For a fixed amount that isn't a task (storage
 * used, a score), it's still a bar, but say so in the label.
 *
 * - role="progressbar", named by its visible `label`, with aria-valuenow,
 *   -min and -max. `valueText` says it in words ("3 of 12 files"), read in
 *   place of the percent and shown at the end of the label row.
 * - Without a `value` it's indeterminate: a band slides along the track (or,
 *   with reduced motion, the track is hatched and still), and screen readers
 *   hear only the label.
 * - `description` sits under the bar ("About 2 minutes left") and is read as
 *   its description. `error` replaces it with a message, and the fill turns
 *   the error colour with a hatched track, so it doesn't rest on colour.
 * - It isn't a live region, so it doesn't chatter. Announce the start and the
 *   end (a toast: "Upload finished") rather than each step.
 * - Ink on a hairline track; size 'sm' (4px) for rows and cards, 'md' (8px).
 */
export interface ProgressBarProps {
  /** Says what's in progress: "Uploading files" */
  label: ReactNode;
  /** Leave out while it can't be measured */
  value?: number;
  max?: number;
  /** The value in words, e.g. "3 of 12 files"; else the percent */
  valueText?: string;
  /** Show the value at the end of the label row */
  showValue?: boolean;
  /** Hide the label visually; it still names the bar */
  hideLabel?: boolean;
  /** Under the bar: time left, what happens next */
  description?: ReactNode;
  /** It stopped: what went wrong and what to do */
  error?: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({
  label, value, max = 100, valueText, showValue = true, hideLabel, description, error, size = 'md', className = '',
}: ProgressBarProps) {
  const id = useId();
  const known = typeof value === 'number' && Number.isFinite(value);
  const clamped = known ? Math.min(Math.max(value!, 0), max) : 0;
  const pct = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const text = known ? (valueText ?? `${pct}%`) : undefined;
  const note = error ?? description;
  const cls = ['progress', size === 'sm' && 'progress--sm', !known && 'progress--indeterminate', error && 'is-error', className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className={hideLabel ? 'visually-hidden' : 'progress__head'}>
        <span className="progress__label" id={`${id}-l`}>{label}</span>
        {showValue && text && !hideLabel && <span className="progress__value" aria-hidden="true">{text}</span>}
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-labelledby={`${id}-l`}
        aria-describedby={note ? `${id}-d` : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={known ? clamped : undefined}
        aria-valuetext={known ? text : undefined}
      >
        <span className="progress__fill" style={known ? { width: `${(clamped / max) * 100}%` } : undefined} />
      </div>
      {note && (
        <p className="progress__note" id={`${id}-d`}>
          {error && <AlertIcon tone="error" />}
          <span>{error && <span className="visually-hidden">Error: </span>}{note}</span>
        </p>
      )}
    </div>
  );
}
