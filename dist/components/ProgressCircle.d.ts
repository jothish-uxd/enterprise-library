import { type ReactNode } from 'react';
/**
 * ProgressCircle — a ring that fills as a task goes, or spins while it waits:
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
export interface ProgressCircleProps {
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
export declare function ProgressCircle({ label, value, max, valueText, size, labelPosition, className, }: ProgressCircleProps): import("react").JSX.Element;
