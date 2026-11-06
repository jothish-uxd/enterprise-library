import { type ReactNode } from 'react';
/**
 * SegmentedControl — choose one of a few short options, inside one tray.
 * Use it to filter content by one property ("Video 4") or to switch the
 * view or mode of the content below (grid / list).
 *
 * It's a radio group built from real radio inputs, so:
 * - Tab moves into the group once, onto the chosen option.
 * - Arrow keys move and choose; screen readers hear
 *   "Type, Video 4, radio button, checked, 3 of 6".
 *
 * Design-system rules
 * - 2 to 6 options with short labels. More, or long labels: Chips or a Select.
 * - It changes what's shown on this page. Moving between pages or panels of
 *   different content is Tabs, not a segmented control.
 * - Chosen is lifted out of the tray (page background and a rule), not coloured.
 * - Icon-only options keep their text label as the radio's name, and show it
 *   in a tooltip on hover and focus.
 * - An unavailable option uses aria-disabled: the arrow keys still reach it but
 *   don't choose it, and disabledReason says why in a tooltip and as its description.
 */
export interface SegmentedOption<V extends string = string> {
    value: V;
    label: string;
    /** Number shown after the label, e.g. how many items this option would show */
    count?: number;
    /** Small outlined icon before the label (16px, currentColor) */
    icon?: ReactNode;
    /** Can't be chosen right now; the arrow keys still reach it. Give a reason. */
    disabled?: boolean;
    disabledReason?: string;
}
interface SegmentedControlProps<V extends string = string> {
    /** Names the group: "Type", "View" */
    label: string;
    /** Show the label beside the control. Default: hidden, read by screen readers only. */
    showLabel?: boolean;
    options: SegmentedOption<V>[];
    value: V;
    onChange: (value: V) => void;
    /** Icons only; each option's label becomes its hidden name */
    iconOnly?: boolean;
    size?: 'sm' | 'md';
    /** Stretch to the full width, options sharing it equally */
    fill?: boolean;
    /** Radio group name; one is made up if you don't pass it */
    name?: string;
    className?: string;
}
export declare function SegmentedControl<V extends string = string>({ label, showLabel, options, value, onChange, iconOnly, size, fill, name, className, }: SegmentedControlProps<V>): import("react").JSX.Element;
export {};
