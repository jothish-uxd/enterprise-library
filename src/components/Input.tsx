import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

/**
 * Input — one line of text: a name, an email, a number, a search. The native
 * input with its label, help and error built in.
 *
 * - The label sits above, help and errors below. Its name is the label; help,
 *   the error and a disabled reason are read as its description:
 *   "Work email, edit text, invalid entry. Enter an email such as name@company.com."
 * - optional: adds "(optional)" to the label. Mark optional fields, not required ones.
 * - icon: a decorative icon inside the start of the box (for example search).
 * - error: replaces the help with the message and its icon, and sets aria-invalid.
 * - readOnly: can be selected and copied, stays in the Tab order.
 * - disabled: aria-disabled plus read only, so it stays in the Tab order and
 *   disabledReason can say why, in a tooltip on hover and focus.
 *
 * Every other input attribute (type, inputMode, autoComplete, placeholder,
 * value, onChange…) goes straight to the input.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'size'> {
  label: ReactNode;
  /** A line under the input */
  help?: ReactNode;
  /** Error message under the input; also marks it invalid */
  error?: ReactNode;
  /** Adds "(optional)" to the label */
  optional?: boolean;
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
  label, help, error, optional, icon, disabled, disabledReason, width = 'full', id, className = '', readOnly, 'aria-describedby': extraDescribedBy, ...rest
}: InputProps) {
  const auto = useId();
  const inputId = id ?? `in-${auto}`;
  const tip = useTooltip(disabled ? disabledReason : null);
  const describedBy = [
    error ? `${inputId}-e` : help ? `${inputId}-h` : null, tip.describedBy, extraDescribedBy,
  ].filter(Boolean).join(' ') || undefined;
  const input = (
    <input
      ref={(el) => { tip.anchorRef.current = el; }}
      id={inputId}
      {...rest}
      readOnly={readOnly || disabled}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...tip.focusProps}
    />
  );
  const cls = ['field', width === 'narrow' && 'field--narrow', disabled && 'is-disabled', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...tip.hoverProps}>
      <label className="field__label" htmlFor={inputId}>
        {label}{optional && <span className="field__optional"> (optional)</span>}
      </label>
      {icon ? <div className="field__control"><span className="field__icon" aria-hidden="true">{icon}</span>{input}</div> : input}
      {error
        ? <span className="field-error" id={`${inputId}-e`}><ErrorIcon />{error}</span>
        : help && <span className="field-help" id={`${inputId}-h`}>{help}</span>}
      {tip.tooltip}
    </div>
  );
}
