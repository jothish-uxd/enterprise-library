import { type ReactNode } from 'react';
/**
 * CheckboxGroup — choose any number from a short list.
 * A fieldset whose legend names the group, so each checkbox is read with it:
 * "Notify when a candidate submits, group. Recruiter, checkbox, checked".
 *
 * - orientation: 'vertical' (default, stacked) or 'horizontal' (a row, for
 *   two or three short options).
 * - selectAll: adds a checkbox first that turns every option on or off. It
 *   shows the mixed state when only some are chosen; the options sit indented
 *   under it.
 * - help and error sit under the last option; the fieldset points at them.
 *   An error replaces the help, with the error icon, and says how to fix it.
 */
export interface CheckboxGroupOption {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
    disabledReason?: ReactNode;
}
interface CheckboxGroupProps {
    legend: ReactNode;
    options: CheckboxGroupOption[];
    value: string[];
    onChange: (value: string[]) => void;
    orientation?: 'vertical' | 'horizontal';
    /** Label for a "select all" checkbox, e.g. "All channels". Leave out for none. */
    selectAll?: ReactNode;
    help?: ReactNode;
    /** Error under the group; replaces the help */
    error?: ReactNode;
    name?: string;
    className?: string;
}
export declare function CheckboxGroup({ legend, options, value, onChange, orientation, selectAll, help, error, name, className, }: CheckboxGroupProps): import("react").JSX.Element;
export {};
