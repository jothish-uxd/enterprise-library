/**
 * StatFilter — a row of counts that also filters what's below it.
 *
 * Each card shows a number and what it counts. Choosing one filters the
 * content it controls. The chosen card borrows the tab marker (ink underline,
 * quiet fill, semibold label), so it reads like a tab without shouting.
 *
 * Design-system rules
 * - Use it when the counts and the filter would otherwise repeat each other.
 *   Plain KPI tiles that don't filter stay as a <dl>.
 * - Toggle buttons in a labelled group (aria-pressed), each pointing at the
 *   region it filters with aria-controls. Exactly one is pressed.
 * - Include an "All" card first when showing everything is a useful state.
 * - Never colour alone: the underline, fill and label weight carry the state.
 */
export interface StatFilterItem<T extends string> {
    value: T;
    label: string;
    count: number;
}
interface Props<T extends string> {
    /** Accessible name of the group, e.g. "Pipeline" */
    label: string;
    items: StatFilterItem<T>[];
    value: T;
    onChange: (value: T) => void;
    /** id of the region the cards filter */
    controls?: string;
    className?: string;
}
export default function StatFilter<T extends string>({ label, items, value, onChange, controls, className }: Props<T>): import("react").JSX.Element;
export {};
