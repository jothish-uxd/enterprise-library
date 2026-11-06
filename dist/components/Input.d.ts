import { type InputHTMLAttributes, type ReactNode } from 'react';
/**
 * Input — one line of text: a name, an email, a number, a search. The native
 * input with its label, description and error built in.
 *
 * - The label sits above, the description and errors below. Its name is the
 *   label; the description, the error and a disabled reason are read as its
 *   description: "Work email, edit text, required, invalid entry. Enter an
 *   email such as name@company.com."
 * - required: an asterisk after the label (hidden from screen readers, which
 *   hear "required" from aria-required instead). Mark the required fields;
 *   leave the others unmarked. The browser's own required check stays off, so
 *   errors use the library's messages.
 * - icon: a decorative icon inside the start of the box (for example search).
 * - error: replaces the description with the message and its icon, and sets aria-invalid.
 * - readOnly: can be selected and copied, stays in the Tab order.
 * - disabled: aria-disabled plus read only, so it stays in the Tab order and
 *   disabledReason can say why, in a tooltip on hover and focus.
 *
 * Every other input attribute (type, inputMode, autoComplete, placeholder,
 * value, onChange…) goes straight to the input.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'size'> {
    label: ReactNode;
    /** A line under the input, read as its description */
    description?: ReactNode;
    /** Error message under the input; replaces the description and marks it invalid */
    error?: ReactNode;
    /** Must be filled in: an asterisk after the label, and aria-required */
    required?: boolean;
    /** A decorative icon at the start of the box, such as a search glass */
    icon?: ReactNode;
    /** Can't be changed right now. Stays focusable; give a reason. */
    disabled?: boolean;
    disabledReason?: ReactNode;
    /** 'narrow' for short values such as a number of points */
    width?: 'full' | 'narrow';
}
export declare function Input({ label, description, error, required, icon, disabled, disabledReason, width, id, className, readOnly, 'aria-describedby': extraDescribedBy, ...rest }: InputProps): import("react").JSX.Element;
