import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumbs — where this page sits: the trail of pages above it, each a link,
 * ending with the current page. For hierarchies at least three levels deep;
 * not a history of where people have been.
 *
 * - A <nav> named "Breadcrumb" holding an ordered list, so screen readers say
 *   "Breadcrumb, navigation, list, 4 items". The last item is the current page
 *   (aria-current="page") and isn't a link.
 * - Items take `to` (a router link) or `href` (a plain link).
 * - maxItems: long trails keep the first and the last few, and fold the middle
 *   into a "…" button ("Show 2 more levels") that opens them in place.
 * - The separators are drawn by CSS and aren't read out.
 */
export interface Crumb {
  label: string;
  /** A router path */
  to?: string;
  /** A plain link, for pages outside the router */
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  /** Show at most this many before folding the middle into "…" */
  maxItems?: number;
  /** The nav's name. Default "Breadcrumb". */
  label?: string;
  className?: string;
}

export function Breadcrumbs({ items, maxItems, label = 'Breadcrumb', className = '' }: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const revealed = useRef<HTMLLIElement>(null);
  const fold = !expanded && maxItems !== undefined && maxItems >= 3 && items.length > maxItems;
  // Keep the first item and the last (maxItems - 1); fold what's between.
  const hidden = fold ? items.length - (maxItems as number) : 0;
  const tailStart = fold ? items.length - ((maxItems as number) - 1) : 1;

  // After opening the fold, put focus on the first level it revealed.
  useEffect(() => {
    if (expanded) revealed.current?.querySelector<HTMLElement>('a, [aria-current]')?.focus();
  }, [expanded]);

  const crumb = (c: Crumb, i: number) => {
    const last = i === items.length - 1;
    return (
      <li key={`${c.label}-${i}`} className="breadcrumbs__item" ref={expanded && i === 1 ? revealed : undefined}>
        {last
          ? <span className="breadcrumbs__current" aria-current="page" tabIndex={-1}>{c.label}</span>
          : c.to ? <Link className="breadcrumbs__link" to={c.to}>{c.label}</Link>
          : c.href ? <a className="breadcrumbs__link" href={c.href}>{c.label}</a>
          : <span className="breadcrumbs__text">{c.label}</span>}
      </li>
    );
  };

  return (
    <nav aria-label={label} className={['breadcrumbs', className].filter(Boolean).join(' ')}>
      <ol className="breadcrumbs__list">
        {fold ? (
          <>
            {crumb(items[0], 0)}
            <li className="breadcrumbs__item">
              <button type="button" className="breadcrumbs__more" aria-label={`Show ${hidden} more ${hidden === 1 ? 'level' : 'levels'}`}
                onClick={() => setExpanded(true)}>…</button>
            </li>
            {items.slice(tailStart).map((c, j) => crumb(c, tailStart + j))}
          </>
        ) : items.map(crumb)}
      </ol>
    </nav>
  );
}
