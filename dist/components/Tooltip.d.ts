import { type ReactNode } from 'react';
/**
 * Tooltip — extra detail beside something on the page. Two versions:
 *
 * trigger="hover" (default): opens on hover or keyboard focus. Text only.
 * - The trigger is a real button with its own name; the tooltip is linked with
 *   aria-describedby (role="tooltip"), so screen readers hear it on focus.
 * - WCAG 1.4.13: hoverable (the pointer can move onto it), dismissable
 *   (Escape closes it without moving focus) and persistent (it stays until
 *   the pointer or focus leaves).
 * - Never put links or buttons in it: it closes as soon as focus moves, so
 *   keyboard and screen reader users could never reach them.
 *
 * trigger="click": opens and closes when the button is pressed. Can hold links.
 * - A disclosure: the button says expanded or collapsed. The panel is a native
 *   popover, so it sits above everything (no clipping), Escape and clicking
 *   outside close it, and Tab moves from the button straight into its links.
 * - Escape returns focus to the button.
 *
 * Both render outside the page flow and position themselves against the
 * trigger, flipping above when there's no room below.
 */
interface Props {
    /** Accessible name of the trigger, e.g. "3 policy matches" or "About proctoring" */
    label: string;
    /** What the trigger shows */
    children: ReactNode;
    /** Tooltip content. Hover: text only. Click: may include links and buttons. */
    content: ReactNode;
    /** How it opens. Default 'hover'. */
    trigger?: 'hover' | 'click';
    className?: string;
    /** Hover only: pass clicks on to a parent (e.g. a table row) */
    onClick?: () => void;
}
export declare function Tooltip(props: Props): import("react").JSX.Element;
/** @deprecated Use Tooltip (trigger="hover"). Kept so 0.1 apps keep working. */
export declare function HoverCard({ card, ...rest }: Omit<Props, 'content' | 'trigger'> & {
    card: ReactNode;
}): import("react").JSX.Element;
export {};
