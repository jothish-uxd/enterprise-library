import { useId, type ReactNode } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';

/**
 * SideNav — a product's pages in a sidebar, in named groups, with the current
 * page marked. For moving between pages; to switch views of one thing use Tabs.
 *
 * - A <nav> named by `label`. Each titled group has a heading (level
 *   `headingLevel`, default 2) that names its list, so screen readers say
 *   "Assessments, list, 3 items". A group with `hideTitle` keeps its name for
 *   screen readers and shows a rule instead.
 * - The current page has aria-current="page" ("Pilot screening v3, current
 *   page, link"), and is marked with semibold ink, a tint and a 3px ink bar,
 *   never colour alone. Router items (`to`) are marked by the router; plain
 *   ones (`href`) by `current`.
 * - `back` is a link up one level ("All jobs"), above everything else.
 * - A group's `icon` sits beside its title and its items line up after it.
 * - `count` sits at the end of an item in mono, read after the label.
 * - A group's `action` is a link at its end ("New assessment"), with a plus.
 * - `top` (a filter field) and `footer` (a credit, a link out) are slots.
 * - On phones, put it behind a menu button in the header (the app shell's job).
 */
export interface SideNavItem {
  label: string;
  /** A router path; the router marks the current page */
  to?: string;
  /** A plain address; mark the current page with `current` */
  href?: string;
  current?: boolean;
  /** Router items: current only on this exact path, not below it */
  end?: boolean;
  count?: number;
  /** Stronger: the record the navigation belongs to */
  strong?: boolean;
}

export interface SideNavGroup {
  /** Names the group; without it the list has no name */
  title?: string;
  /** Keep the title for screen readers only, with a rule above the group */
  hideTitle?: boolean;
  /** Beside the title; the items line up after it */
  icon?: ReactNode;
  items: SideNavItem[];
  /** Shown when there are no items, e.g. "No assessments yet." */
  empty?: string;
  /** A link at the end of the group, e.g. "New assessment" */
  action?: { label: string; to?: string; href?: string };
}

export interface SideNavProps {
  /** Names the navigation for screen readers, e.g. "Starfighter Pilot L4" */
  label: string;
  groups: SideNavGroup[];
  back?: { label: string; to?: string; href?: string };
  /** The heading level of group titles */
  headingLevel?: 2 | 3 | 4;
  /** Above the groups: a filter field */
  top?: ReactNode;
  /** At the bottom: a credit, a link out */
  footer?: ReactNode;
  className?: string;
  id?: string;
}

const BACK = <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M10 3 5 8l5 5" /></svg>;
const PLUS = <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 3v10M3 8h10" /></svg>;

function Item({ item }: { item: SideNavItem }) {
  const cls = ['sidenav__link', item.strong && 'sidenav__link--strong'].filter(Boolean).join(' ');
  const body = (
    <>
      <span className="sidenav__label">{item.label}</span>
      {item.count !== undefined && <span className="sidenav__count">{item.count.toLocaleString('en-US')}</span>}
    </>
  );
  if (item.to) return <NavLink to={item.to} end={item.end} className={cls}>{body}</NavLink>;
  return <a href={item.href} className={cls} aria-current={item.current ? 'page' : undefined}>{body}</a>;
}

function Plain({ to, href, className, children }: { to?: string; href?: string; className: string; children: ReactNode }) {
  return to ? <RouterLink to={to} className={className}>{children}</RouterLink> : <a href={href} className={className}>{children}</a>;
}

export function SideNav({ label, groups, back, headingLevel = 2, top, footer, className = '', id }: SideNavProps) {
  const uid = useId();
  const Heading = `h${headingLevel}` as 'h2';
  return (
    <nav id={id} className={['sidenav', className].filter(Boolean).join(' ')} aria-label={label}>
      {back && <Plain to={back.to} href={back.href} className="sidenav__back">{BACK}{back.label}</Plain>}
      {top && <div className="sidenav__top">{top}</div>}
      {groups.map((g, i) => {
        const hid = g.title ? `${uid}-g${i}` : undefined;
        const cls = ['sidenav__group', g.hideTitle && 'sidenav__group--ruled', g.icon && 'sidenav__group--icon'].filter(Boolean).join(' ');
        return (
          <div key={i} className={cls}>
            {g.title && (
              <Heading id={hid} className={g.hideTitle ? 'visually-hidden' : 'sidenav__heading'}>
                {g.icon && !g.hideTitle && <span className="sidenav__icon" aria-hidden="true">{g.icon}</span>}
                {g.title}
              </Heading>
            )}
            {g.items.length > 0 && (
              <ul className="sidenav__list" aria-labelledby={hid}>
                {g.items.map((it) => <li key={it.to ?? it.href ?? it.label}><Item item={it} /></li>)}
              </ul>
            )}
            {g.items.length === 0 && g.empty && <p className="sidenav__empty">{g.empty}</p>}
            {g.action && <Plain to={g.action.to} href={g.action.href} className="sidenav__action">{PLUS}{g.action.label}</Plain>}
          </div>
        );
      })}
      {footer && <div className="sidenav__footer">{footer}</div>}
    </nav>
  );
}
