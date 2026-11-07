import { type ReactNode } from 'react';
/**
 * Tabs — switch between panels of related content in one place, such as a
 * record's Overview, Activity and Settings (WAI-ARIA tabs). Not for moving
 * between pages (use links or the side navigation) or for filtering one list
 * (use a SegmentedControl).
 *
 * - The list is named by `label`; each tab says its place and whether it's
 *   chosen: "Activity, tab, selected, 2 of 3". Its panel is named by the tab.
 * - Tab moves into the list (onto the chosen tab), then on into the panel.
 *   Left and Right move between tabs and wrap; Home and End jump.
 *   activation 'automatic' (default) shows a panel as soon as its tab is
 *   reached; 'manual' waits for Enter or Space, for panels that are slow to load.
 * - An unavailable tab uses aria-disabled: the arrow keys still reach it, it
 *   can't be chosen, and disabledReason says why in a tooltip and as its description.
 * - The chosen tab is marked with full ink and a 2px rule under it, never colour.
 * - All panels stay mounted (hidden) so what people typed survives switching.
 */
export interface TabItem<V extends string = string> {
    value: V;
    label: string;
    /** A count after the label, e.g. open items */
    count?: number;
    /** The panel shown when this tab is chosen */
    panel: ReactNode;
    /** Can't be chosen right now; stays reachable. Give a reason. */
    disabled?: boolean;
    disabledReason?: string;
}
export interface TabsProps<V extends string = string> {
    /** Names the tab list for screen readers, e.g. "Assessment sections" */
    label: string;
    tabs: TabItem<V>[];
    value: V;
    onChange: (value: V) => void;
    /** 'automatic' (default): arrows choose. 'manual': arrows move, Enter or Space chooses. */
    activation?: 'automatic' | 'manual';
    size?: 'sm' | 'md';
    /** Tabs share the width equally */
    fill?: boolean;
    className?: string;
}
export declare function Tabs<V extends string = string>({ label, tabs, value, onChange, activation, size, fill, className, }: TabsProps<V>): import("react").JSX.Element;
