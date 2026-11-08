import { type ReactNode } from 'react';
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
    action?: {
        label: string;
        to?: string;
        href?: string;
    };
}
export interface SideNavProps {
    /** Names the navigation for screen readers, e.g. "Starfighter Pilot L4" */
    label: string;
    groups: SideNavGroup[];
    back?: {
        label: string;
        to?: string;
        href?: string;
    };
    /** The heading level of group titles */
    headingLevel?: 2 | 3 | 4;
    /** Above the groups: a filter field */
    top?: ReactNode;
    /** At the bottom: a credit, a link out */
    footer?: ReactNode;
    className?: string;
    id?: string;
}
export declare function SideNav({ label, groups, back, headingLevel, top, footer, className, id }: SideNavProps): import("react").JSX.Element;
