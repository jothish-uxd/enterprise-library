import { type ReactNode } from 'react';
/**
 * RadioGroup — choose exactly one from a short list, every option in view.
 * A fieldset with role="radiogroup", named by its legend:
 * "When results are shared, radio group, required. After review, radio button, checked, 1 of 3".
 *
 * - Tab moves into the group, onto the chosen option (or the first if none);
 *   the arrow keys move and choose. Unavailable options are still reached by
 *   the arrow keys, can't be chosen, and say why.
 * - orientation: 'vertical' (default, stacked) or 'horizontal' (a row, for
 *   two or three short options).
 * - required: an asterisk after the legend (hidden from screen readers) and
 *   aria-required on the group, which screen readers announce.
 * - description and error sit under the last option; the group points at them.
 *   An error replaces the description, with the error icon, and sets aria-invalid.
 * - value '' means nothing chosen yet. Choose a sensible default when there is one.
 */
export interface RadioGroupOption {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
    disabledReason?: ReactNode;
}
export interface RadioGroupProps {
    legend: ReactNode;
    options: RadioGroupOption[];
    /** The chosen value; '' for none */
    value: string;
    onChange: (value: string) => void;
    orientation?: 'vertical' | 'horizontal';
    /** One must be chosen: an asterisk after the legend, and aria-required */
    required?: boolean;
    /** A line under the options, read as the group's description */
    description?: ReactNode;
    /** Error under the group; replaces the description and marks it invalid */
    error?: ReactNode;
    /** Shared by every radio; one is made up if left out */
    name?: string;
    className?: string;
}
export declare function RadioGroup({ legend, options, value, onChange, orientation, required, description, error, name, className, }: RadioGroupProps): import("react").JSX.Element;
