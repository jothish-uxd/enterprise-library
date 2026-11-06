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

export function Tiles({ layout = 'tiled', columns, minWidth, label, id, className = '', children }: TilesProps) {
  const style: Record<string, string> = {};
  if (columns) style['--tiles-columns'] = String(columns);
  if (minWidth) style['--tiles-min'] = `${minWidth}px`;
  const cls = ['tiles', layout === 'cards' && 'tiles--cards', className].filter(Boolean).join(' ');
  return <ul className={cls} id={id} aria-label={label} style={style}>{children}</ul>;
}

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
