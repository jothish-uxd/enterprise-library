import { useId, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

/**
 * Radio — one option among several; choosing it un-chooses the others.
 * Radios always come in a group: use RadioGroup, or give every Radio the same
 * name inside a fieldset with a legend. Never use one alone; for a single
 * yes or no, use a Checkbox.
 *
 * - Its name is the label only; a description is read as its description:
 *   "After review, radio button, checked, 1 of 3. A recruiter checks scores first."
 * - disabled: aria-disabled, so the arrow keys still reach it and can't choose
 *   it; disabledReason shows why in a tooltip on hover and focus.
 * - Required and errors belong to the group, not to one radio (see RadioGroup).
 */
export interface RadioProps {
  label: ReactNode;
  /** Shared by every radio in the group */
  name: string;
  value: string;
  checked: boolean;
  /** Called with this radio's value when it's chosen */
  onChange: (value: string) => void;
  /** A line under the label */
  description?: ReactNode;
  /** Can't be chosen right now. Stays reachable; give a reason. */
  disabled?: boolean;
  disabledReason?: ReactNode;
  id?: string;
  className?: string;
}

export function Radio({ label, name, value, checked, onChange, description, disabled, disabledReason, id, className = '' }: RadioProps) {
  const auto = useId();
  const inputId = id ?? `rb-${auto}`;
  const tip = useTooltip(disabled ? disabledReason : null);
  const describedBy = [description ? `${inputId}-d` : null, tip.describedBy].filter(Boolean).join(' ') || undefined;
  const cls = ['check', description && 'check--desc', disabled && 'is-disabled', className].filter(Boolean).join(' ');
  return (
    <>
      <label className={cls} htmlFor={inputId} {...tip.hoverProps}>
        <input
          ref={(el) => { tip.anchorRef.current = el; }}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          aria-labelledby={`${inputId}-l`}
          aria-describedby={describedBy}
          aria-disabled={disabled || undefined}
          onChange={() => { if (!disabled) onChange(value); }}
          onClick={(e) => { if (disabled) e.preventDefault(); }}
          {...tip.focusProps}
        />
        <span className="check__text">
          <span className="check__label" id={`${inputId}-l`}>{label}</span>
          {description && <span className="check__desc" id={`${inputId}-d`}>{description}</span>}
        </span>
      </label>
      {tip.tooltip}
    </>
  );
}
