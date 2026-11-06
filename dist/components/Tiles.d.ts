import type { ElementType, ReactNode } from 'react';
/**
 * Tiles — a grid of links into other pages: a section's index, a gallery of
 * patterns or templates, a set of tools to open. Plain markup underneath; use
 * the classes directly when that's simpler.
 *
 * Two layouts:
 * - 'tiled' (default): cells share 1px hairlines with square corners, like a
 *   table. Best for many items and for items with a picture.
 * - 'cards': separate bordered boxes with a gap and rounded corners. Best for
 *   a handful of items, or next to Card content.
 *
 * Design-system rules
 * - Each tile is one link: the whole tile is the target, and its title is the
 *   link's name. Never put a second control in a tile.
 * - Tiles are navigation. Content people compare or act on is a Card.
 * - The picture is decoration (aria-hidden); the title and description carry
 *   the meaning.
 */
interface TilesProps {
    layout?: 'tiled' | 'cards';
    /** Most columns to show (default 3); fewer appear when the space is narrow */
    columns?: number;
    /** Narrowest a column may get before the grid drops a column (default 220px tiled, 240px cards) */
    minWidth?: number;
    /** Name for the list, when the heading above it doesn't already say what it is */
    label?: string;
    id?: string;
    className?: string;
    children: ReactNode;
}
export declare function Tiles({ layout, columns, minWidth, label, id, className, children }: TilesProps): import("react").JSX.Element;
interface TileProps {
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
export {};
