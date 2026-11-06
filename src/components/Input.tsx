import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

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

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
);

export function Input({
  label, description, error, required, icon, disabled, disabledReason, width = 'full', id, className = '', readOnly, 'aria-describedby': extraDescribedBy, ...rest
}: InputProps) {
  const auto = useId();
  const inputId = id ?? `in-${auto}`;
  const tip = useTooltip(disabled ? disabledReason : null);
  const describedBy = [
    error ? `${inputId}-e` : description ? `${inputId}-h` : null, tip.describedBy, extraDescribedBy,
  ].filter(Boolean).join(' ') || undefined;
  const input = (
    <input
      ref={(el) => { tip.anchorRef.current = el; }}
      id={inputId}
      {...rest}
      readOnly={readOnly || disabled}
      aria-disabled={disabled || undefined}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...tip.focusProps}
    />
  );
  const cls = ['field', width === 'narrow' && 'field--narrow', disabled && 'is-disabled', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...tip.hoverProps}>
      <label className="field__label" htmlFor={inputId}>
        {label}{required && <span className="field__required" aria-hidden="true">*</span>}
      </label>
      {icon ? <div className="field__control"><span className="field__icon" aria-hidden="true">{icon}</span>{input}</div> : input}
      {error
        ? <span className="field-error" id={`${inputId}-e`}><ErrorIcon />{error}</span>
        : description && <span className="field-help" id={`${inputId}-h`}>{description}</span>}
      {tip.tooltip}
    </div>
  );
}
