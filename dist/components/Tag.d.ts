import { type ReactNode, type RefObject } from 'react';
import { type StatusMarkShape } from './StatusMark';
/**
 * Tag — a short label on a thing: a type, a keyword, a skill. Mono, small and
 * quiet; not a button and not a filter (use Chips to filter).
 *
 * - `onDismiss` adds a remove button after the label, named "Remove {label}"
 *   (or `dismissLabel`). Its target is 24px, bigger than it looks.
 * - `strong` shows it in full ink, to set one tag apart: "Live" among "Soon".
 * - `color` tints it (red, amber, green, teal, blue, purple, pink; gray is the
 *   default), for categories and statuses across large sets of data, such as
 *   a status column. The words always carry the meaning; add a `mark` (a
 *   status mark shape) when the colour stands for a status, so it's told
 *   apart by shape too.
 * - In a TagList, removing a tag moves focus to the next tag's remove button
 *   (or the previous one, or `emptyFocus` when none are left) and says
 *   "Removed {label}" politely, so keyboard users never lose their place.
 */
export type TagColor = 'gray' | 'red' | 'amber' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';
export interface TagProps {
    children: ReactNode;
    /** A tint, for categories and statuses in large sets of data (default gray) */
    color?: TagColor;
    /** A status mark shape before the label, so a status reads by shape too */
    mark?: StatusMarkShape;
    /** Show a remove button; called when it's pressed */
    onDismiss?: () => void;
    /** Names the remove button; default "Remove {children}" */
    dismissLabel?: string;
    strong?: boolean;
    className?: string;
}
export declare function Tag({ children, color, mark, onDismiss, dismissLabel, strong, className }: TagProps): import("react").JSX.Element;
/** A tag in a list: its words, and optionally a colour and mark */
export type TagItem = string | {
    label: string;
    color?: TagColor;
    mark?: StatusMarkShape;
};
export interface TagListProps {
    /** Names the list for screen readers: "Skills" */
    label?: string;
    /** Or the id of a visible element that names it */
    labelledBy?: string;
    tags: TagItem[];
    /** Makes the tags removable */
    onRemove?: (tag: string) => void;
    /** Where focus goes when the last tag is removed, e.g. the field that adds tags */
    emptyFocus?: RefObject<HTMLElement | null>;
    /** Shown when there are no tags */
    empty?: ReactNode;
    className?: string;
}
export declare function TagList({ label, labelledBy, tags, onRemove, emptyFocus, empty, className }: TagListProps): import("react").JSX.Element;
export interface TagInputProps {
    /** The field's visible label, which also names the list: "Skills" */
    label: ReactNode;
    tags: TagItem[];
    onChange: (tags: string[]) => void;
    /** Under the field; default "Press Enter to add each one." */
    description?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    placeholder?: string;
    /** The most tags allowed */
    max?: number;
    /** Shown under the field when there are no tags */
    empty?: ReactNode;
    className?: string;
}
/**
 * TagInput — a labelled field that adds tags, with the tags listed below it,
 * each removable. Generalised from a skills field.
 *
 * - Type and press Enter (or a comma) to add. Blank entries and duplicates
 *   aren't added; "Added Navigation", "Navigation is already added" and
 *   "You can add up to 5" are announced politely.
 * - The list below is named by the label: "Skills, list, 3 items". Removing a
 *   tag moves focus to the next tag's remove button, and back to the field
 *   when none are left.
 * - required, description and error work as on Input.
 */
export declare function TagInput({ label, tags, onChange, description, error, required, placeholder, max, empty, className, }: TagInputProps): import("react").JSX.Element;
