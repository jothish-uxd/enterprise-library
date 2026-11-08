import { type ReactNode } from 'react';
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
export declare function Loader({ type, label, value, max, valueText, size, labelPosition, lines, className, }: LoaderProps): import("react").JSX.Element;
