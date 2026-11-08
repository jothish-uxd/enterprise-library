import { type AnchorHTMLAttributes, type ReactNode } from 'react';
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
export declare function Link({ children, to, href, newTab, className, rel, ...rest }: LinkProps): import("react").JSX.Element;
