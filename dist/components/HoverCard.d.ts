import { type ReactNode } from 'react';
/**
 * HoverCard — details that appear on hover or keyboard focus.
 *
 * Design-system rules (WCAG 1.4.13, content on hover or focus)
 * - The trigger is a real button with its own name; the card is extra detail,
 *   linked with aria-describedby, so screen readers hear it on focus.
 * - Hoverable: moving the pointer from the trigger onto the card keeps it open.
 * - Dismissable: Escape closes it without moving focus.
 * - Persistent: it stays until the pointer or focus leaves.
 * - The card holds text only, never links or buttons: put actions in the page.
 * - It renders at the end of <body> and positions itself against the trigger,
 *   so scrolling regions never clip it. It flips above when there's no room below.
 */
interface Props {
    /** Accessible name of the trigger, e.g. "3 policy matches" */
    label: string;
    /** What the trigger shows */
    children: ReactNode;
    /** Card content (text only) */
    card: ReactNode;
    className?: string;
    /** Pass clicks on to a parent (e.g. a table row) instead of stopping them */
    onClick?: () => void;
}
export default function HoverCard({ label, children, card, className, onClick }: Props): import("react").JSX.Element;
export {};
