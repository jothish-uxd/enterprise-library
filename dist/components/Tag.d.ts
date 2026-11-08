import { type ReactNode, type RefObject } from 'react';
/**
 * Tag — a short label on a thing: a type, a keyword, a skill. Mono, small and
 * quiet; not a button and not a filter (use Chips to filter).
 *
 * - `onDismiss` adds a remove button after the label, named "Remove {label}"
 *   (or `dismissLabel`). Its target is 24px, bigger than it looks.
 * - `strong` shows it in full ink, to set one tag apart: "Live" among "Soon".
 * - In a TagList, removing a tag moves focus to the next tag's remove button
 *   (or the previous one, or `emptyFocus` when none are left) and says
 *   "Removed {label}" politely, so keyboard users never lose their place.
 */
export interface TagProps {
    children: ReactNode;
    /** Show a remove button; called when it's pressed */
    onDismiss?: () => void;
    /** Names the remove button; default "Remove {children}" */
    dismissLabel?: string;
    strong?: boolean;
    className?: string;
}
export declare function Tag({ children, onDismiss, dismissLabel, strong, className }: TagProps): import("react").JSX.Element;
export interface TagListProps {
    /** Names the list for screen readers: "Skills" */
    label: string;
    tags: string[];
    /** Makes the tags removable */
    onRemove?: (tag: string) => void;
    /** Where focus goes when the last tag is removed, e.g. the field that adds tags */
    emptyFocus?: RefObject<HTMLElement | null>;
    /** Shown when there are no tags */
    empty?: ReactNode;
    className?: string;
}
export declare function TagList({ label, tags, onRemove, emptyFocus, empty, className }: TagListProps): import("react").JSX.Element;
