import { type ReactNode } from 'react';
/**
 * Menu — a button that opens a short list of actions (WAI-ARIA menu button).
 * For actions on one thing ("Options for Pilot screening v3"), not for
 * navigation (use links) or for choosing a value (use Select).
 *
 * - The button says it has a menu and whether it's open: "Options for Pilot
 *   screening v3, menu button, collapsed".
 * - Opening moves focus into the menu. Up and Down move (and wrap), Home and End
 *   jump, typing a letter jumps to the next item starting with it, Enter or
 *   Space chooses, Escape closes and returns focus to the button, Tab closes
 *   and moves on.
 * - An unavailable item stays in the arrow-key order and says why under its
 *   label, read as its description; choosing it does nothing.
 * - danger: for an action that destroys something. It's set in medium ink
 *   weight after a rule; ask for confirmation in a Dialog before doing it.
 * - The list opens below the button, or above it when there's no room.
 */
export interface MenuItem {
    label: string;
    onSelect: () => void;
    /** A small icon before the label; decorative */
    icon?: ReactNode;
    /** Can't be chosen right now; stays reachable. Give a reason. */
    disabled?: boolean;
    disabledReason?: string;
    /** Draws a rule above this item, to start a new group */
    divider?: boolean;
    /** Destroys something; confirm in a Dialog before doing it */
    danger?: boolean;
}
export interface MenuProps {
    /** The button's name, e.g. "Options for Pilot screening v3" */
    label: string;
    items: MenuItem[];
    /** What the button shows: text, an icon, or both */
    children: ReactNode;
    /** Icon-only button: square, with label as its name */
    iconOnly?: boolean;
    variant?: 'secondary' | 'ghost' | 'primary';
    size?: 'sm' | 'md';
    /** Line the list up with the button's start or end edge. Default 'end'. */
    align?: 'start' | 'end';
    className?: string;
}
export declare function Menu({ label, items, children, iconOnly, variant, size, align, className, }: MenuProps): import("react").JSX.Element;
