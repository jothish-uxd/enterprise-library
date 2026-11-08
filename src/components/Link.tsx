import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Link — goes somewhere. (To do something, use a Button.)
 *
 * - In body text or on its own line, it looks the same: medium weight and a
 *   full-ink underline, so it reads as a link by more than colour (WCAG 1.4.1).
 *   On hover the underline goes; with keyboard focus it stays, with the focus
 *   ring.
 * - newTab: opens in a new tab, with a small box-and-arrow icon kept on the
 *   same line as the last word, and "(opens in a new tab)" for screen readers,
 *   so nobody is surprised where they end up. Adds rel="noopener noreferrer".
 * - `to` is a router path; `href` a plain address. A new-tab link always uses
 *   a plain address.
 */
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target'> {
  children: ReactNode;
  /** A router path */
  to?: string;
  /** A plain address */
  href?: string;
  /** Opens in a new tab; shows the icon and says so to screen readers */
  newTab?: boolean;
}

const NEW_TAB_ICON = (
  <svg className="link__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M9.5 2.5h4v4M13.5 2.5 8 8M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
  </svg>
);

export function Link({ children, to, href, newTab, className = '', rel, ...rest }: LinkProps) {
  const cls = ['link', newTab && 'link--new-tab', className].filter(Boolean).join(' ');
  const content = newTab ? (
    <>
      {children}
      {/* A word joiner keeps the icon on the same line as the last word */}
      <span className="link__new-tab">{'⁠'}{NEW_TAB_ICON}<span className="visually-hidden"> (opens in a new tab)</span></span>
    </>
  ) : children;

  if (to && !newTab) return <RouterLink className={cls} to={to} {...rest}>{content}</RouterLink>;
  return (
    <a
      className={cls}
      href={href ?? to}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? ['noopener', 'noreferrer', rel].filter(Boolean).join(' ') : rel}
      {...rest}
    >
      {content}
    </a>
  );
}
