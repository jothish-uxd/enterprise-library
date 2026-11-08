import { type ReactNode } from 'react';
/**
 * Skeleton — grey shapes where content will appear, in roughly its shape, so
 * the page holds its layout while it loads and doesn't jump when it arrives.
 * For a wait with no content to stand in for, use a Loader.
 *
 * - `lines` of text, with an optional `heading` bar and `avatar` circle;
 *   `rows` repeats the block, for a list.
 * - One role="progressbar" for the whole skeleton, named by `label`
 *   ("Loading candidates"), which is for screen readers only. The shapes are
 *   hidden from them.
 * - The shapes shimmer; with reduced motion they hold still.
 * - Mark the area that's loading with aria-busy, and swap the skeleton for the
 *   content in the same place.
 */
export interface SkeletonProps {
    /** For screen readers: what's loading */
    label: ReactNode;
    /** Lines of text in each row (default 3) */
    lines?: number;
    /** A wider, taller first bar, for a title */
    heading?: boolean;
    /** A circle at the start, for a person or a file */
    avatar?: boolean;
    /** Repeat the block, for a list (default 1) */
    rows?: number;
    className?: string;
}
export declare function Skeleton({ label, lines, heading, avatar, rows, className }: SkeletonProps): import("react").JSX.Element;
