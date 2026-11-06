import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

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

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
);

export function Checkbox({
  label, checked, onChange, description, indeterminate = false, required, error, disabled, disabledReason, name, value, id, className = '',
}: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? `cb-${auto}`;
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  const tip = useTooltip(disabled ? disabledReason : null);
  const describedBy = [description ? `${inputId}-d` : null, error ? `${inputId}-e` : null, tip.describedBy].filter(Boolean).join(' ') || undefined;
  const cls = ['check', description && 'check--desc', disabled && 'is-disabled', error && 'is-invalid'].filter(Boolean).join(' ');
  return (
    <div className={`check-field ${className}`.trim()}>
      <label className={cls} htmlFor={inputId} {...tip.hoverProps}>
        <input
          ref={(el) => { ref.current = el; tip.anchorRef.current = el; }}
          id={inputId}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          aria-labelledby={`${inputId}-l`}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-disabled={disabled || undefined}
          onChange={(e) => { if (!disabled) onChange(e.target.checked); }}
          onClick={(e) => { if (disabled) e.preventDefault(); }}
          {...tip.focusProps}
        />
        <span className="check__text">
          <span className="check__label" id={`${inputId}-l`}>{label}{required && <span className="field__required" aria-hidden="true">*</span>}</span>
          {description && <span className="check__desc" id={`${inputId}-d`}>{description}</span>}
        </span>
      </label>
      {error && <span className="field-error check__error" id={`${inputId}-e`}><ErrorIcon />{error}</span>}
      {tip.tooltip}
    </div>
  );
}
