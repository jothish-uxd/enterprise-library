import { NavLink } from 'react-router-dom';

/**
 * HeaderNav — a product's top-level sections as links across the app header
 * (Overview, Jobs, Talent). For moving between sections; the side navigation
 * moves within one.
 *
 * - A <nav> named by `label` (default "Primary"), holding a list of links.
 * - The current section has aria-current="page" and is marked with full ink
 *   and a 2px ink rule along the header's bottom edge, never colour. Router
 *   items (`to`) are marked by the router, and stay current on pages below
 *   them; plain ones (`href`) by `current`.
 * - It stretches to the header's height, so the rule sits on the header's
 *   bottom border. When the links don't fit, the row scrolls sideways.
 */
export interface HeaderNavItem {
  label: string;
  to?: string;
  href?: string;
  current?: boolean;
  /** Router items: current only on this exact path */
  end?: boolean;
}

export interface HeaderNavProps {
  items: HeaderNavItem[];
  /** Names the navigation for screen readers */
  label?: string;
  className?: string;
}

export function HeaderNav({ items, label = 'Primary', className = '' }: HeaderNavProps) {
  return (
    <nav className={['headernav', className].filter(Boolean).join(' ')} aria-label={label}>
      <ul className="headernav__list">
        {items.map((it) => (
          <li key={it.to ?? it.href ?? it.label} className="headernav__item">
            {it.to
              ? <NavLink to={it.to} end={it.end} className="headernav__link">{it.label}</NavLink>
              : <a href={it.href} className="headernav__link" aria-current={it.current ? 'page' : undefined}>{it.label}</a>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
