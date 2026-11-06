import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
);
import type { SelectOption } from './Select';

interface Props<T extends string | number> {
  label: string;
  value: T[];
  options: SelectOption<T>[];
  onChange: (value: T[]) => void;
  className?: string;
  /** id of help text that describes the field */
  describedBy?: string;
  /** Show the label beside the button instead of above it */
  inline?: boolean;
  /** Keep the label for screen readers only */
  hideLabel?: boolean;
  /** Shown when nothing is chosen, e.g. "Any channel" */
  placeholder?: string;
  invalid?: boolean;
  /** A line under the field, read as its description */
  description?: ReactNode;
  /** Error message under the field; replaces the description and marks it invalid */
  error?: ReactNode;
  /** Must be answered: an asterisk after the label, and aria-required */
  required?: boolean;
  /** Can't be changed right now. Stays focusable and doesn't open; give a reason. */
  disabled?: boolean;
  disabledReason?: ReactNode;
  /** id for the button, so error summaries can link to it */
  buttonId?: string;
}

/**
 * MultiSelect — Select's look and keyboard, for choosing several options.
 * WAI-ARIA select-only combobox whose listbox is aria-multiselectable.
 *
 * - The button shows what's chosen: "Email, Teams +2", or the placeholder.
 * - Enter or Space turns the active option on or off and keeps the list open,
 *   so people can choose several in a row. Escape or Tab closes it.
 * - Each option has a box that fills when chosen, so the state is a shape.
 * - The button keeps focus; options are announced through aria-activedescendant
 *   with "selected" or "not selected".
 *
 * Use it when there are too many options for a checkbox group (about 7 or more)
 * or the form has no room for them. With fewer, a checkbox group is easier:
 * every option is visible without opening anything.
 *
 * Field parts, as on Input: description under the field; error replaces it with
 * the error icon and sets aria-invalid; required adds an asterisk after the
 * label (hidden from screen readers, which hear "required" from aria-required);
 * disabled uses aria-disabled, so the button stays in the Tab order, won't
 * open or change, and disabledReason shows why in a tooltip on hover and focus.
 * describedBy and invalid still work for help and errors kept outside the field.
 */
export default function MultiSelect<T extends string | number>({
  label, value, options, onChange, className, describedBy, inline, hideLabel, placeholder = 'None', invalid, buttonId,
  description, error, required, disabled, disabledReason,
}: Props<T>) {
  const id = useId();
  const tip = useTooltip(disabled ? disabledReason : null);
  const ids = [error ? `${id}-err` : description ? `${id}-desc` : null, describedBy, tip.describedBy].filter(Boolean).join(' ') || undefined;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [above, setAbove] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });

  const isOn = (v: T) => value.includes(v);
  const toggle = (i: number) => {
    const v = options[i].value;
    onChange(isOn(v) ? value.filter((x) => x !== v) : options.map((o) => o.value).filter((x) => x === v || value.includes(x)));
  };
  const firstChosen = Math.max(0, options.findIndex((o) => isOn(o.value)));
  const openList = (at = firstChosen) => { setActive(at); setOpen(true); };

  const chosen = options.filter((o) => isOn(o.value));
  const summary = chosen.length === 0 ? placeholder
    : chosen.length <= 2 ? chosen.map((o) => o.label).join(', ')
    : `${chosen[0].label}, ${chosen[1].label} +${chosen.length - 2}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !listRef.current) return;
    const scroller = buttonRef.current.closest('[data-scroll]') ?? document.documentElement;
    const b = buttonRef.current.getBoundingClientRect();
    const area = scroller.getBoundingClientRect();
    const h = listRef.current.offsetHeight;
    setAbove(b.bottom + h + 8 > area.bottom && b.top - h - 8 > area.top);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const typeahead = (ch: string) => {
    const now = Date.now();
    const t = typed.current;
    t.text = now - t.at > 600 ? ch.toLowerCase() : t.text + ch.toLowerCase();
    t.at = now;
    const order = [...options.keys()].map((k) => (active + 1 + k) % options.length);
    const hit = order.find((i) => options[i].label.toLowerCase().startsWith(t.text));
    if (hit !== undefined) { if (!open) setOpen(true); setActive(hit); }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = options.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(); }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); openList(e.key === 'Home' ? 0 : last); }
      else if (e.key.length === 1) typeahead(e.key);
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break;
      case 'ArrowUp': e.preventDefault(); if (e.altKey) setOpen(false); else setActive((a) => Math.max(0, a - 1)); break;
      case 'Home': e.preventDefault(); setActive(0); break;
      case 'End': e.preventDefault(); setActive(last); break;
      case 'PageDown': e.preventDefault(); setActive((a) => Math.min(last, a + 10)); break;
      case 'PageUp': e.preventDefault(); setActive((a) => Math.max(0, a - 10)); break;
      case 'Enter': case ' ': e.preventDefault(); toggle(active); break;
      case 'Escape': e.preventDefault(); setOpen(false); break;
      case 'Tab': setOpen(false); break;
      default: if (e.key.length === 1) typeahead(e.key);
    }
  };

  return (
    <div className={`field select select--multi${inline ? ' field--inline' : ''}${disabled ? ' is-disabled' : ''}${className ? ` ${className}` : ''}`} ref={wrapRef} {...tip.hoverProps}>
      <span className={hideLabel ? 'visually-hidden' : 'field__label'} id={`${id}-label`}>{label}{required && <span className="field__required" aria-hidden="true">*</span>}</span>
      <div className="select__anchor">
        <button
          ref={(el) => { buttonRef.current = el; tip.anchorRef.current = el; }}
          id={buttonId}
          type="button"
          role="combobox"
          className="select__button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-describedby={ids}
          aria-invalid={invalid || error ? true : undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          onClick={() => { if (disabled) return; if (open) setOpen(false); else openList(); }}
          onKeyDown={(e) => { if (!disabled) onKeyDown(e); }}
          onFocus={tip.focusProps.onFocus}
          onBlur={(e) => { tip.focusProps.onBlur(); if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
        >
          <span id={`${id}-value`} className={`select__value${chosen.length === 0 ? ' is-placeholder' : ''}`}>
            {summary}{chosen.length > 2 && <span className="visually-hidden">, {chosen.length} chosen</span>}
          </span>
          <svg className="select__chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
        </button>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          className={`select__list${above ? ' is-above' : ''}`}
          hidden={!open}
        >
          {options.map((o, i) => (
            <li
              key={String(o.value)}
              id={`${id}-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={isOn(o.value)}
              className={`select__option${i === active ? ' is-active' : ''}`}
              onMouseMove={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setActive(i); toggle(i); buttonRef.current?.focus(); }}
            >
              <span className="select__box" aria-hidden="true">
                <svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.5l4.5-5" /></svg>
              </span>
              <span>{o.label}</span>
            </li>
          ))}
        </ul>
      </div>
      {error
        ? <span className="field-error" id={`${id}-err`}><ErrorIcon />{error}</span>
        : description ? <span className="field-help" id={`${id}-desc`}>{description}</span> : null}
      {tip.tooltip}
    </div>
  );
}
