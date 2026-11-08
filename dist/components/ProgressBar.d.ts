import { type ReactNode } from 'react';
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
export declare function ProgressBar({ label, value, max, valueText, showValue, hideLabel, description, error, size, className, }: ProgressBarProps): import("react").JSX.Element;
