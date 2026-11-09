import { type ReactNode } from 'react';
/**
 * List — a bulleted (ul) or numbered (ol) list in the library's style.
 *
 * - marker 'bullet' (ul) or 'number' (ol) keeps the browser's own markers,
 *   in faint ink. 'check' and 'none' draw their own, so the list gets
 *   role="list" (Safari drops list semantics when markers are removed).
 *   'steps' is an ol with numbers in rings, for instructions.
 * - divided: a rule between items. compact: less space. inline: one row
 *   separated by dots.
 * - Nest a List inside an item for a second level: hollow bullets or letters.
 * - Screen readers say "list, 4 items" and, for numbered lists, each item's
 *   number.
 */
export interface ListProps {
    children: ReactNode;
    marker?: 'bullet' | 'number' | 'check' | 'none' | 'steps';
    divided?: boolean;
    compact?: boolean;
    inline?: boolean;
    /** Names the list when there's no heading right before it */
    label?: string;
    className?: string;
}
export declare function List({ children, marker, divided, compact, inline, label, className }: ListProps): import("react").JSX.Element;
/**
 * DescriptionList — terms and their details: the facts about a record.
 *
 * - A real <dl>, each term and its details grouped in a <div>. Screen readers
 *   read each term followed by its details.
 * - layout 'stacked' (default): term above details. 'columns': side by side,
 *   ruled like a table (stacked again on phones). 'grid': a grid of facts that
 *   fills the width. 'row': facts in one wrapping line, under a page title.
 * - A term can have more than one detail: pass an array.
 */
export interface DescriptionListProps {
    items: {
        term: ReactNode;
        details: ReactNode | ReactNode[];
    }[];
    layout?: 'stacked' | 'columns' | 'grid' | 'row';
    className?: string;
}
export declare function DescriptionList({ items, layout, className }: DescriptionListProps): import("react").JSX.Element;
