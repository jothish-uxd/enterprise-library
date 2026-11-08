import { type ReactNode } from 'react';
/**
 * StatusMark — a status in words, with a small mark that shows the same thing
 * by shape: a dashed ring for not started, half filled for in progress, a check
 * for done. Never colour, and never the mark alone: the words carry the meaning
 * and the mark is hidden from screen readers.
 *
 * Marks are named by shape, so each product maps its own statuses to them:
 * - dashed  not started, pending, draft
 * - ring    open, ready, scheduled
 * - half    in progress, in review, on hold
 * - filled  live, published, active
 * - check   complete, passed, approved
 * - slash   failed, denied, cancelled
 *
 * variant 'badge' puts it in a small bordered box, for a table cell or a card
 * header; a 'check' badge is filled ink. `muted` softens the words for things
 * that are over (closed, archived).
 */
export type StatusMarkShape = 'dashed' | 'ring' | 'half' | 'filled' | 'check' | 'slash';
export interface StatusMarkProps {
    mark: StatusMarkShape;
    /** The status in words: always shown, always read */
    children: ReactNode;
    variant?: 'plain' | 'badge';
    size?: 'sm' | 'md';
    /** Softer words, for statuses that are over */
    muted?: boolean;
    className?: string;
}
/** Just the mark, for use inside another component such as a Tag */
export declare function StatusMarkIcon({ mark, className }: {
    mark: StatusMarkShape;
    className?: string;
}): import("react").JSX.Element;
export declare function StatusMark({ mark, children, variant, size, muted, className }: StatusMarkProps): import("react").JSX.Element;
