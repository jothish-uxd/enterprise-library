import { type ReactNode } from 'react';
/**
 * Accordion — a stack of sections people open one or more of, so a long page
 * shows its outline first: test cases, FAQs, settings groups (WAI-ARIA
 * accordion). Not for switching between views of one thing (use Tabs) or for a
 * single show/hide (use a button with aria-expanded).
 *
 * - Each header is a heading (level `headingLevel`, default 3) holding one
 *   button: "Test case 1.2, button, collapsed". Its panel is a region named by
 *   the header (only while there are 6 sections or fewer, so landmarks don't
 *   pile up).
 * - Tab moves between headers and into an open panel; Enter or Space opens and
 *   closes. Up and Down move between headers; Home and End jump.
 * - `single` keeps one section open at a time; otherwise any number open.
 * - `meta` (a StatusMark, a count) and `actions` (icon buttons) sit beside the
 *   header button, never inside it.
 * - A section that can't open uses aria-disabled: it stays reachable, and
 *   disabledReason says why in a tooltip and as its description.
 * - Open or closed is shown by the chevron's shape, never colour. Closed panels
 *   stay mounted (hidden) so what people typed survives, and use
 *   hidden="until-found" where supported, so find-in-page opens them.
 * - layout 'joined' (default): rules between sections, for a page's flow.
 *   'separate': each section its own bordered box, for cards like test cases.
 */
export interface AccordionItem<V extends string = string> {
    value: V;
    title: ReactNode;
    /** The panel's content */
    content: ReactNode;
    /** Beside the title, outside the button: a status, a count */
    meta?: ReactNode;
    /** At the end of the header, outside the button: icon buttons */
    actions?: ReactNode;
    /** Can't be opened right now; stays reachable. Give a reason. */
    disabled?: boolean;
    disabledReason?: string;
}
export interface AccordionProps<V extends string = string> {
    items: AccordionItem<V>[];
    /** Open sections, when you control it */
    open?: V[];
    /** Open sections at first, when it controls itself */
    defaultOpen?: V[];
    onOpenChange?: (open: V[]) => void;
    /** One section open at a time */
    single?: boolean;
    /** The heading level of each header, to fit the page outline */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    layout?: 'joined' | 'separate';
    className?: string;
}
export declare function Accordion<V extends string = string>({ items, open: openProp, defaultOpen, onOpenChange, single, headingLevel, layout, className, }: AccordionProps<V>): import("react").JSX.Element;
