import { type ReactNode } from 'react';
import type { SelectOption } from './Select';
interface Props<T extends string | number> {
    label: string;
    value: T[];
    options: SelectOption<T>[];
    onChange: (value: T[]) => void;
    className?: string;
    /** id of help text that describes the field */
    describedBy?: string;
    /** Show the label beside the button instead of above it */
    inline?: boolean;
    /** Keep the label for screen readers only */
    hideLabel?: boolean;
    /** Shown when nothing is chosen, e.g. "Any channel" */
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
 * MultiSelect — Select's look and keyboard, for choosing several options.
 * WAI-ARIA select-only combobox whose listbox is aria-multiselectable.
 *
 * - The button shows what's chosen: "Email, Teams +2", or the placeholder.
 * - Enter or Space turns the active option on or off and keeps the list open,
 *   so people can choose several in a row. Escape or Tab closes it.
 * - Each option has a box that fills when chosen, so the state is a shape.
 * - The button keeps focus; options are announced through aria-activedescendant
 *   with "selected" or "not selected".
 *
 * Use it when there are too many options for a checkbox group (about 7 or more)
 * or the form has no room for them. With fewer, a checkbox group is easier:
 * every option is visible without opening anything.
 *
 * Field parts, as on Input: description under the field; error replaces it with
 * the error icon and sets aria-invalid; required adds an asterisk after the
 * label (hidden from screen readers, which hear "required" from aria-required);
 * disabled uses aria-disabled, so the button stays in the Tab order, won't
 * open or change, and disabledReason shows why in a tooltip on hover and focus.
 * describedBy and invalid still work for help and errors kept outside the field.
 */
export default function MultiSelect<T extends string | number>({ label, value, options, onChange, className, describedBy, inline, hideLabel, placeholder, invalid, buttonId, description, error, required, disabled, disabledReason, }: Props<T>): import("react").JSX.Element;
export {};
