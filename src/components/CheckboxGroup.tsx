import { useId, type ReactNode } from 'react';
import { Checkbox } from './Checkbox';

/**
 * CheckboxGroup — choose any number from a short list.
 * A fieldset whose legend names the group, so each checkbox is read with it:
 * "Notify when a candidate submits, group. Recruiter, checkbox, checked".
 *
 * - orientation: 'vertical' (default, stacked) or 'horizontal' (a row, for
 *   two or three short options).
 * - selectAll: adds a checkbox first that turns every option on or off. It
 *   shows the mixed state when only some are chosen; the options sit indented
 *   under it.
 * - help and error sit under the last option; the fieldset points at them.
 *   An error replaces the help, with the error icon, and says how to fix it.
 */
export interface CheckboxGroupOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean; disabledReason?: ReactNode }

interface CheckboxGroupProps {
  legend: ReactNode;
  options: CheckboxGroupOption[];
  value: string[];
  onChange: (value: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
  /** Label for a "select all" checkbox, e.g. "All channels". Leave out for none. */
  selectAll?: ReactNode;
  help?: ReactNode;
  /** Error under the group; replaces the help */
  error?: ReactNode;
  name?: string;
  className?: string;
}

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
);

export function CheckboxGroup({
  legend, options, value, onChange, orientation = 'vertical', selectAll, help, error, name, className = '',
}: CheckboxGroupProps) {
  const id = useId();
  const usable = options.filter((o) => !o.disabled);
  const chosen = usable.filter((o) => value.includes(o.value)).length;
  const all = usable.length > 0 && chosen === usable.length;
  const toggle = (v: string, on: boolean) =>
    onChange(on ? options.map((o) => o.value).filter((x) => x === v || value.includes(x)) : value.filter((x) => x !== v));
  const setAll = (on: boolean) =>
    onChange(on ? Array.from(new Set([...value, ...usable.map((o) => o.value)])) : value.filter((x) => !usable.some((o) => o.value === x)));

  const horizontal = orientation === 'horizontal';
  const list = (
    <div className={['checks', !horizontal && 'checks--stack', selectAll && 'checks--nested'].filter(Boolean).join(' ')}>
      {options.map((o) => (
        <Checkbox key={o.value} name={name} value={o.value} label={o.label} description={o.description}
          checked={value.includes(o.value)} onChange={(on) => toggle(o.value, on)}
          disabled={o.disabled} disabledReason={o.disabledReason} />
      ))}
    </div>
  );
  const note = error ? `${id}-e` : help ? `${id}-h` : undefined;
  return (
    <fieldset className={['checks', 'checks--stack', 'checkbox-group', error && 'is-invalid', className].filter(Boolean).join(' ')} aria-describedby={note}>
      <legend className="field__label">{legend}</legend>
      {selectAll && <Checkbox label={selectAll} checked={all} indeterminate={chosen > 0 && !all} onChange={setAll} />}
      {list}
      {error ? <span className="field-error" id={`${id}-e`}><ErrorIcon />{error}</span>
        : help ? <span className="field-help" id={`${id}-h`}>{help}</span> : null}
    </fieldset>
  );
}
