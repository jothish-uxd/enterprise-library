import { type ReactNode, type TextareaHTMLAttributes } from 'react';
/**
 * TextArea — several lines of text: instructions, notes, a reason. The native
 * textarea with its label, description, error and an optional character counter.
 *
 * - Same field parts as Input: the name is the label; the description, the
 *   error, the counter and a disabled reason are read as its description.
 * - required: an asterisk after the label (hidden from screen readers, which
 *   hear "required" from aria-required).
 * - limit: shows "102 characters left" under the field, then "6 characters too
 *   many" in semibold ink. It never cuts off what people typed (it isn't
 *   maxLength). Going over marks the field invalid. A polite live region speaks
 *   only when people reach the limit or go past it, not on every key.
 * - error: replaces the description, with the error icon, and sets aria-invalid.
 * - readOnly: can be selected and copied, stays in the Tab order.
 * - disabled: aria-disabled plus read only, so it stays in the Tab order;
 *   disabledReason says why in a tooltip on hover and focus.
 * - Resizes vertically. rows sets the starting height (default 3).
 */
export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled'> {
    label: ReactNode;
    /** A line under the field, read as its description */
    description?: ReactNode;
    /** Error message under the field; replaces the description and marks it invalid */
    error?: ReactNode;
    /** Must be filled in: an asterisk after the label, and aria-required */
    required?: boolean;
    /** A character limit, counted under the field. Never cuts off text. */
    limit?: number;
    /** Can't be changed right now. Stays focusable; give a reason. */
    disabled?: boolean;
    disabledReason?: ReactNode;
    /** 'wide' caps it at 720px for long answers in a wide column */
    width?: 'full' | 'wide';
}
export declare function TextArea({ label, description, error, required, limit, disabled, disabledReason, width, id, className, readOnly, rows, value, defaultValue, onChange, 'aria-describedby': extraDescribedBy, ...rest }: TextAreaProps): import("react").JSX.Element;
