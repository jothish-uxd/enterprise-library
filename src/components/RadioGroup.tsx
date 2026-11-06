import { useId, type ReactNode } from 'react';
import { Radio } from './Radio';

/**
 * RadioGroup — choose exactly one from a short list, every option in view.
 * A fieldset with role="radiogroup", named by its legend:
 * "When results are shared, radio group, required. After review, radio button, checked, 1 of 3".
 *
 * - Tab moves into the group, onto the chosen option (or the first if none);
 *   the arrow keys move and choose. Unavailable options are still reached by
 *   the arrow keys, can't be chosen, and say why.
 * - orientation: 'vertical' (default, stacked) or 'horizontal' (a row, for
 *   two or three short options).
 * - required: an asterisk after the legend (hidden from screen readers) and
 *   aria-required on the group, which screen readers announce.
 * - description and error sit under the last option; the group points at them.
 *   An error replaces the description, with the error icon, and sets aria-invalid.
 * - value '' means nothing chosen yet. Choose a sensible default when there is one.
 */
export interface RadioGroupOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean; disabledReason?: ReactNode }

export interface RadioGroupProps {
  legend: ReactNode;
  options: RadioGroupOption[];
  /** The chosen value; '' for none */
  value: string;
  onChange: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  /** One must be chosen: an asterisk after the legend, and aria-required */
  required?: boolean;
  /** A line under the options, read as the group's description */
  description?: ReactNode;
  /** Error under the group; replaces the description and marks it invalid */
  error?: ReactNode;
  /** Shared by every radio; one is made up if left out */
  name?: string;
  className?: string;
}

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
);

export function RadioGroup({
  legend, options, value, onChange, orientation = 'vertical', required, description, error, name, className = '',
}: RadioGroupProps) {
  const id = useId();
  const groupName = name ?? `rg-${id}`;
  const note = error ? `${id}-e` : description ? `${id}-h` : undefined;
  const horizontal = orientation === 'horizontal';
  return (
    <fieldset
      role="radiogroup"
      className={['checks', 'checks--stack', 'radio-group', error && 'is-invalid', className].filter(Boolean).join(' ')}
      aria-labelledby={`${id}-l`}
      aria-describedby={note}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="field__label" id={`${id}-l`}>
        {legend}{required && <span className="field__required" aria-hidden="true">*</span>}
      </legend>
      <div className={horizontal ? 'checks' : 'checks checks--stack'}>
        {options.map((o) => (
          <Radio key={o.value} name={groupName} value={o.value} label={o.label} description={o.description}
            checked={value === o.value} onChange={onChange} disabled={o.disabled} disabledReason={o.disabledReason} />
        ))}
      </div>
      {error ? <span className="field-error" id={`${id}-e`}><ErrorIcon />{error}</span>
        : description ? <span className="field-help" id={`${id}-h`}>{description}</span> : null}
    </fieldset>
  );
}
