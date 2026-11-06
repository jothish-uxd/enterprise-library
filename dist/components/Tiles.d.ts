import type { ElementType, ReactNode } from 'react';
/**
 * Tiles — a grid of links into other pages: a section's index, a gallery of
 * patterns or templates, a set of tools to open. Plain markup underneath; use
 * the classes directly when that's simpler.
 *
 * Two layouts:
 * - 'joined' (default): no gap. Tiles share 1px hairlines with square corners
 *   and read as one index, like a table of contents. Best for many short items
 *   people scan.
 * - 'separate': a gap between tiles; each has its own border and rounded
 *   corners and reads as its own object. Best for a handful of richer items,
 *   especially with pictures.
 * 'tiled' and 'cards' still work as old names for 'joined' and 'separate'.
 *
 * Design-system rules
 * - Each tile is one link: the whole tile is the target, and its title is the
 *   link's name. Never put a second control in a tile.
 * - Tiles are navigation. Content people compare or act on is a Card.
 * - The picture is decoration (aria-hidden); the title and description carry
 *   the meaning.
 */
export interface TilesProps {
    /** 'joined' (default, no gap) or 'separate' (a gap, each tile its own box). 'tiled' and 'cards' are old names. */
    layout?: 'joined' | 'separate' | 'tiled' | 'cards';
    /** Most columns to show (default 3); fewer appear when the space is narrow */
    columns?: number;
    /** Narrowest a column may get before the grid drops a column (default 220px joined, 240px separate) */
    minWidth?: number;
    /** Name for the list, when the heading above it doesn't already say what it is */
    label?: string;
    id?: string;
    className?: string;
    children: ReactNode;
}
export declare function Tiles({ layout, columns, minWidth, label, id, className, children }: TilesProps): import("react").JSX.Element;
export interface TileProps {
    title: ReactNode;
    description?: ReactNode;
    /** Short mono label at the right of the title, e.g. "Live", "React" */
    tag?: ReactNode;
    /** Show the tag in full ink, e.g. for "Live" against "Soon" */
    tagStrong?: boolean;
    /** Decorative picture above the title, usually an inline SVG drawn with currentColor */
    media?: ReactNode;
    /** Where the tile goes. With `as`, pass that component's own props instead (e.g. `to`). */
    href?: string;
    /** Link component to render, e.g. react-router's Link. Defaults to <a>. */
    as?: ElementType;
    /** Hide the tile, e.g. when a filter leaves it out */
    hidden?: boolean;
    /** Extra props for the link element (e.g. `to`, `onClick`, `aria-current`) */
    linkProps?: Record<string, unknown>;
    className?: string;
}
export declare function Tile({ title, description, tag, tagStrong, media, href, as: Link, hidden, linkProps, className }: TileProps): import("react").JSX.Element;
