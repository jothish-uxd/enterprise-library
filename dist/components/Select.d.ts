import { type ReactNode } from 'react';
export interface SelectOption<T extends string | number> {
    value: T;
    label: string;
}
interface Props<T extends string | number> {
    label: string;
    value: T;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    className?: string;
    /** id of help text that describes the field */
    describedBy?: string;
    /** Show the label beside the button instead of above it */
    inline?: boolean;
    /** Keep the label for screen readers only (the context already names the field) */
    hideLabel?: boolean;
    /** Shown when the value isn't one of the options, e.g. "Select an option" */
    placeholder?: string;
    invalid?: boolean;
    /** A line under the field, read as its description */
    description?: ReactNode;
    /** Error message under the field; replaces the description and marks it invalid */
    error?: ReactNode;
    /** Must be answered: an asterisk after the label, and aria-required */
    required?: boolean;
    /** Can't be changed right now. Stays focusable and doesn't open; give a reason. */
    disabled?: boolean;
    disabledReason?: ReactNode;
    /** id for the button, so error summaries can link to it */
    buttonId?: string;
}
/**
 * Custom dropdown in the a11y-charts style (WAI-ARIA "select-only combobox").
 * The button keeps focus; the list is announced through aria-activedescendant.
 * Keys: Enter, Space, Alt+Down or Down to open; Up/Down, Home/End and typing to move;
 * Enter or Space to choose; Escape to close without choosing; Tab chooses and moves on.
 *
 * Field parts, as on Input: description under the field; error replaces it with
 * the error icon and sets aria-invalid; required adds an asterisk after the
 * label (hidden from screen readers, which hear "required" from aria-required);
 * disabled uses aria-disabled, so the button stays in the Tab order, won't
 * open or change, and disabledReason shows why in a tooltip on hover and focus.
 * describedBy and invalid still work for help and errors kept outside the field.
 */
export default function Select<T extends string | number>({ label, value, options, onChange, className, describedBy, inline, hideLabel, placeholder, invalid, buttonId, description, error, required, disabled, disabledReason, }: Props<T>): import("react").JSX.Element;
export {};
