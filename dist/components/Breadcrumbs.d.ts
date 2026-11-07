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
export declare function Breadcrumbs({ items, maxItems, label, className }: BreadcrumbsProps): import("react").JSX.Element;
