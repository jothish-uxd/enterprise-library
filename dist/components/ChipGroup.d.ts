/**
 * ChipGroup — separate pill buttons that filter what's below. They wrap onto
 * more lines, so they suit many options, and they can be multi-select.
 *
 * Each chip is a toggle button (aria-pressed) in a labelled group, so each is
 * a Tab stop and Enter or Space toggles it: "Escalated 3, toggle button,
 * pressed". Multi-select chips show a check when chosen, so the state is a
 * shape as well as a fill.
 *
 * Design-system rules
 * - Use chips for multi-select filters, or single-select filters with more
 *   than about 6 options or options that change. For 2 to 6 fixed options,
 *   choose one: SegmentedControl.
 * - Single-select always has one chip on (offer "All" first); a chosen chip
 *   can't be turned off by pressing it again.
 * - Say how many results are showing in a polite live region.
 */
export interface ChipOption<V extends string = string> {
    value: V;
    label: string;
    count?: number;
    disabled?: boolean;
}
interface BaseProps<V extends string> {
    /** Names the group: "Filter by status" */
    label: string;
    options: ChipOption<V>[];
    size?: 'sm' | 'md';
    /** id of the region the chips filter */
    controls?: string;
    className?: string;
}
interface SingleProps<V extends string> extends BaseProps<V> {
    multiple?: false;
    value: V;
    onChange: (value: V) => void;
}
interface MultiProps<V extends string> extends BaseProps<V> {
    multiple: true;
    value: V[];
    onChange: (value: V[]) => void;
}
export declare function ChipGroup<V extends string = string>(props: MultiProps<V>): JSX.Element;
export declare function ChipGroup<V extends string = string>(props: SingleProps<V>): JSX.Element;
export {};
