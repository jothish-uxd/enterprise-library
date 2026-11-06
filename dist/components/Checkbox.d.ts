import { type ReactNode } from 'react';
/**
 * Checkbox — one yes-or-no choice, sent with the form. The native checkbox,
 * drawn in ink, with the accessible parts built in.
 *
 * - Its name is the label only; a description and an error are read as its
 *   description: "Accept the terms, checkbox, not checked, invalid entry.
 *   Accept the terms to continue."
 * - required: an asterisk after the label (hidden from screen readers, which
 *   hear "required" from aria-required). For a box people must tick, such as terms.
 * - error: shows the message under the label with the error icon, and sets
 *   aria-invalid. Say how to fix it.
 * - indeterminate: the mixed state, for a "select all" when some are chosen.
 * - disabled: aria-disabled, so it stays in the Tab order and can't change;
 *   disabledReason shows why in a tooltip on hover and focus.
 *
 * Plain HTML still works: <label class="check"><input type="checkbox"> …</label>.
 */
interface CheckboxProps {
    label: ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** A line under the label */
    description?: ReactNode;
    /** Mixed: some of a group are chosen. Use for "select all". */
    indeterminate?: boolean;
    /** Must be ticked: an asterisk after the label, and aria-required */
    required?: boolean;
    /** Error message under the label; also marks it invalid */
    error?: ReactNode;
    /** Can't be changed right now. Stays focusable; give a reason. */
    disabled?: boolean;
    disabledReason?: ReactNode;
    name?: string;
    value?: string;
    id?: string;
    className?: string;
}
export declare function Checkbox({ label, checked, onChange, description, indeterminate, required, error, disabled, disabledReason, name, value, id, className, }: CheckboxProps): import("react").JSX.Element;
export {};
