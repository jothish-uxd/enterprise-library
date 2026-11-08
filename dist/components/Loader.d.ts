import { type ReactNode } from 'react';
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
export declare function Loader({ type, label, value, max, valueText, size, labelPosition, className, }: LoaderProps): import("react").JSX.Element;
