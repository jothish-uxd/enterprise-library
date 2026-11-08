import { useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { StatusMarkIcon, type StatusMarkShape } from './StatusMark';

/**
 * Tag — a short label on a thing: a type, a keyword, a skill. Mono, small and
 * quiet; not a button and not a filter (use Chips to filter).
 *
 * - `onDismiss` adds a remove button after the label, named "Remove {label}"
 *   (or `dismissLabel`). Its target is 24px, bigger than it looks.
 * - `strong` shows it in full ink, to set one tag apart: "Live" among "Soon".
 * - `color` tints it (red, amber, green, teal, blue, purple, pink; gray is the
 *   default), for categories and statuses across large sets of data, such as
 *   a status column. The words always carry the meaning; add a `mark` (a
 *   status mark shape) when the colour stands for a status, so it's told
 *   apart by shape too.
 * - In a TagList, removing a tag moves focus to the next tag's remove button
 *   (or the previous one, or `emptyFocus` when none are left) and says
 *   "Removed {label}" politely, so keyboard users never lose their place.
 */
export type TagColor = 'gray' | 'red' | 'amber' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';

export interface TagProps {
  children: ReactNode;
  /** A tint, for categories and statuses in large sets of data (default gray) */
  color?: TagColor;
  /** A status mark shape before the label, so a status reads by shape too */
  mark?: StatusMarkShape;
  /** Show a remove button; called when it's pressed */
  onDismiss?: () => void;
  /** Names the remove button; default "Remove {children}" */
  dismissLabel?: string;
  strong?: boolean;
  className?: string;
}

const X = <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 2l6 6M8 2 2 8" /></svg>;

export function Tag({ children, color = 'gray', mark, onDismiss, dismissLabel, strong, className = '' }: TagProps) {
  const cls = ['tag', color !== 'gray' && `tag--${color}`, strong && 'tag--strong', onDismiss && 'tag--dismissible', className].filter(Boolean).join(' ');
  const name = dismissLabel ?? `Remove ${typeof children === 'string' ? children : 'tag'}`;
  return (
    <span className={cls}>
      {mark && <StatusMarkIcon mark={mark} className="tag__mark" />}
      <span className="tag__label">{children}</span>
      {onDismiss && <button type="button" className="tag__dismiss" aria-label={name} onClick={onDismiss}>{X}</button>}
    </span>
  );
}

/** A tag in a list: its words, and optionally a colour and mark */
export type TagItem = string | { label: string; color?: TagColor; mark?: StatusMarkShape };
const labelOf = (t: TagItem) => (typeof t === 'string' ? t : t.label);

export interface TagListProps {
  /** Names the list for screen readers: "Skills" */
  label?: string;
  /** Or the id of a visible element that names it */
  labelledBy?: string;
  tags: TagItem[];
  /** Makes the tags removable */
  onRemove?: (tag: string) => void;
  /** Where focus goes when the last tag is removed, e.g. the field that adds tags */
  emptyFocus?: RefObject<HTMLElement | null>;
  /** Shown when there are no tags */
  empty?: ReactNode;
  className?: string;
}

export function TagList({ label, labelledBy, tags, onRemove, emptyFocus, empty, className = '' }: TagListProps) {
  const id = useId();
  const list = useRef<HTMLUListElement>(null);
  const [said, setSaid] = useState('');

  const remove = (t: string, i: number) => {
    onRemove?.(t);
    setSaid(`Removed ${t}`);
    // After the list re-renders, land on the tag that took its place
    requestAnimationFrame(() => {
      const buttons = list.current?.querySelectorAll<HTMLButtonElement>('.tag__dismiss');
      const next = buttons && (buttons[Math.min(i, buttons.length - 1)] ?? null);
      (next ?? emptyFocus?.current ?? list.current?.closest<HTMLElement>('[tabindex]'))?.focus?.();
    });
  };

  return (
    <div className={['tag-list', className].filter(Boolean).join(' ')}>
      {tags.length > 0 ? (
        <ul ref={list} className="tag-list__items" aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy}>
          {tags.map((t, i) => {
            const name = labelOf(t);
            const extra = typeof t === 'string' ? {} : { color: t.color, mark: t.mark };
            return <li key={name}><Tag {...extra} onDismiss={onRemove ? () => remove(name, i) : undefined}>{name}</Tag></li>;
          })}
        </ul>
      ) : empty ? <p className="tag-list__empty">{empty}</p> : null}
      <span className="visually-hidden" role="status" id={`${id}-s`}>{said}</span>
    </div>
  );
}

export interface TagInputProps {
  /** The field's visible label, which also names the list: "Skills" */
  label: ReactNode;
  tags: TagItem[];
  onChange: (tags: string[]) => void;
  /** Under the field; default "Press Enter to add each one." */
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  placeholder?: string;
  /** The most tags allowed */
  max?: number;
  /** Shown under the field when there are no tags */
  empty?: ReactNode;
  className?: string;
}

/**
 * TagInput — a labelled field that adds tags, with the tags listed below it,
 * each removable. Generalised from a skills field.
 *
 * - Type and press Enter (or a comma) to add. Blank entries and duplicates
 *   aren't added; "Added Navigation", "Navigation is already added" and
 *   "You can add up to 5" are announced politely.
 * - The list below is named by the label: "Skills, list, 3 items". Removing a
 *   tag moves focus to the next tag's remove button, and back to the field
 *   when none are left.
 * - required, description and error work as on Input.
 */
export function TagInput({
  label, tags, onChange, description = 'Press Enter to add each one.', error, required, placeholder, max, empty, className = '',
}: TagInputProps) {
  const id = useId();
  const field = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [said, setSaid] = useState('');
  const names = tags.map(labelOf);

  const say = (m: string) => { setSaid(''); setTimeout(() => setSaid(m), 30); };
  const add = () => {
    const t = text.trim().replace(/,+$/, '').trim();
    if (!t) return;
    if (names.some((n) => n.toLowerCase() === t.toLowerCase())) { say(`${t} is already added`); setText(''); return; }
    if (max !== undefined && names.length >= max) { say(`You can add up to ${max}`); return; }
    onChange([...names, t]);
    setText('');
    say(`Added ${t}`);
  };

  const helpId = error ? `${id}-e` : description ? `${id}-h` : undefined;
  return (
    <div className={['field', 'tag-input', className].filter(Boolean).join(' ')}>
      <label className="field__label" id={`${id}-l`} htmlFor={`${id}-i`}>
        {label}{required && <span className="field__required" aria-hidden="true">*</span>}
      </label>
      <input
        ref={field}
        id={`${id}-i`}
        value={text}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={helpId}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
      />
      {error
        ? <span className="field-error" id={`${id}-e`}><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8v3.6M8 11h.01" /></svg>{error}</span>
        : description && <span className="field-help" id={`${id}-h`}>{description}</span>}
      <TagList labelledBy={`${id}-l`} tags={tags} empty={empty} emptyFocus={field}
        onRemove={(t) => onChange(names.filter((n) => n !== t))} />
      <span className="visually-hidden" role="status">{said}</span>
    </div>
  );
}
