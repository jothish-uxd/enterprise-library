import { useId, type ReactNode } from 'react';

/**
 * SegmentedControl — choose one of a few short options, inside one tray.
 * Use it to filter content by one property ("Video 4") or to switch the
 * view or mode of the content below (grid / list).
 *
 * It's a radio group built from real radio inputs, so:
 * - Tab moves into the group once, onto the chosen option.
 * - Arrow keys move and choose; screen readers hear
 *   "Type, Video 4, radio button, checked, 3 of 6".
 *
 * Design-system rules
 * - 2 to 6 options with short labels. More, or long labels: Chips or a Select.
 * - It changes what's shown on this page. Moving between pages or panels of
 *   different content is Tabs, not a segmented control.
 * - Chosen is lifted out of the tray (page background and a rule), not coloured.
 * - Icon-only options keep their text label as the radio's name.
 */

export interface SegmentedOption<V extends string = string> {
  value: V;
  label: string;
  /** Number shown after the label, e.g. how many items this option would show */
  count?: number;
  /** Small outlined icon before the label (16px, currentColor) */
  icon?: ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps<V extends string = string> {
  /** Names the group: "Type", "View" */
  label: string;
  /** Show the label beside the control. Default: hidden, read by screen readers only. */
  showLabel?: boolean;
  options: SegmentedOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Icons only; each option's label becomes its hidden name */
  iconOnly?: boolean;
  size?: 'sm' | 'md';
  /** Stretch to the full width, options sharing it equally */
  fill?: boolean;
  /** Radio group name; one is made up if you don't pass it */
  name?: string;
  className?: string;
}

export function SegmentedControl<V extends string = string>({
  label, showLabel, options, value, onChange, iconOnly, size = 'md', fill, name, className = '',
}: SegmentedControlProps<V>) {
  const id = useId();
  const groupName = name ?? `seg-${id}`;
  const cls = ['segmented', size === 'sm' && 'segmented--sm', iconOnly && 'segmented--icons', fill && 'segmented--fill', className].filter(Boolean).join(' ');
  const group = (
    <div className={cls} role="radiogroup" aria-label={showLabel ? undefined : label} aria-labelledby={showLabel ? `${id}-l` : undefined}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <label key={o.value} className={`segmented__opt${on ? ' is-on' : ''}`} title={iconOnly ? o.label : undefined}>
            <input className="segmented__input" type="radio" name={groupName} value={o.value} checked={on} disabled={o.disabled}
              onChange={() => onChange(o.value)} />
            {o.icon && <span className="segmented__icon" aria-hidden="true">{o.icon}</span>}
            <span className={iconOnly ? 'visually-hidden' : 'segmented__label'}>{o.label}</span>
            {o.count !== undefined && <span className="segmented__count">{o.count}</span>}
          </label>
        );
      })}
    </div>
  );
  if (!showLabel) return group;
  return (
    <div className="segmented-field">
      <span className="segmented-field__label" id={`${id}-l`}>{label}</span>
      {group}
    </div>
  );
}
