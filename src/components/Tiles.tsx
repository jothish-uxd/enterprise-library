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

export function Tiles({ layout = 'joined', columns, minWidth, label, id, className = '', children }: TilesProps) {
  const style: Record<string, string> = {};
  if (columns) style['--tiles-columns'] = String(columns);
  if (minWidth) style['--tiles-min'] = `${minWidth}px`;
  const separate = layout === 'separate' || layout === 'cards';
  const cls = ['tiles', separate && 'tiles--separate', className].filter(Boolean).join(' ');
  return <ul className={cls} id={id} aria-label={label} style={style}>{children}</ul>;
}

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

export function Tile({ title, description, tag, tagStrong, media, href, as: Link = 'a', hidden, linkProps, className = '' }: TileProps) {
  return (
    <li className={`tile ${className}`.trim()} hidden={hidden}>
      <Link className="tile__link" href={href} {...linkProps}>
        {media && <span className="tile__media" aria-hidden="true">{media}</span>}
        <span className="tile__head">
          <span className="tile__title">{title}</span>
          {tag && <span className={`tile__tag${tagStrong ? ' tile__tag--strong' : ''}`}>{tag}</span>}
        </span>
        {description && <span className="tile__desc">{description}</span>}
      </Link>
    </li>
  );
}
