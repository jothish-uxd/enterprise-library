import { useEffect, useId, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { useTooltip } from './Tooltip';

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

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
);

const chars = (n: number) => `${n} ${n === 1 ? 'character' : 'characters'}`;

export function TextArea({
  label, description, error, required, limit, disabled, disabledReason, width = 'full', id, className = '', readOnly, rows = 3,
  value, defaultValue, onChange, 'aria-describedby': extraDescribedBy, ...rest
}: TextAreaProps) {
  const auto = useId();
  const fieldId = id ?? `ta-${auto}`;
  const tip = useTooltip(disabled ? disabledReason : null);

  // Count from the controlled value, or follow the text when uncontrolled.
  const [own, setOwn] = useState(String(defaultValue ?? ''));
  const length = (value !== undefined ? String(value) : own).length;
  const left = limit != null ? limit - length : 0;
  const over = limit != null && left < 0;
  const counter = limit == null ? null : over ? `${chars(-left)} too many` : `${chars(left)} left`;

  // Speak only when crossing into "at the limit" or "over".
  const [spoken, setSpoken] = useState('');
  const was = useRef<string | null>(null);
  const state = limit == null ? 'none' : over ? 'over' : left === 0 ? 'at' : 'under';
  useEffect(() => {
    if (was.current !== null && state !== was.current && (state === 'at' || state === 'over')) setSpoken(counter ?? '');
    was.current = state;
  }, [state, counter]);

  const describedBy = [
    error ? `${fieldId}-e` : description ? `${fieldId}-h` : null, counter ? `${fieldId}-c` : null, tip.describedBy, extraDescribedBy,
  ].filter(Boolean).join(' ') || undefined;
  const note = error
    ? <span className="field-error" id={`${fieldId}-e`}><ErrorIcon />{error}</span>
    : description ? <span className="field-help" id={`${fieldId}-h`}>{description}</span> : null;
  const cls = ['field', width === 'wide' && 'field--wide', disabled && 'is-disabled', className].filter(Boolean).join(' ');

  return (
    <div className={cls} {...tip.hoverProps}>
      <label className="field__label" htmlFor={fieldId}>
        {label}{required && <span className="field__required" aria-hidden="true">*</span>}
      </label>
      <textarea
        ref={(el) => { tip.anchorRef.current = el; }}
        id={fieldId}
        rows={rows}
        {...rest}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(e) => { if (value === undefined) setOwn(e.target.value); onChange?.(e); }}
        readOnly={readOnly || disabled}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-invalid={error || over ? true : undefined}
        aria-describedby={describedBy}
        {...tip.focusProps}
      />
      {counter
        ? <div className="field__foot">{note}<span className={`field__counter${over ? ' is-over' : ''}`} id={`${fieldId}-c`}>{counter}</span></div>
        : note}
      {limit != null && <span className="visually-hidden" role="status" aria-live="polite">{spoken}</span>}
      {tip.tooltip}
    </div>
  );
}
