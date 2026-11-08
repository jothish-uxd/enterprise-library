import { useId, useRef, useState, type ReactNode, type RefObject } from 'react';

/**
 * Tag — a short label on a thing: a type, a keyword, a skill. Mono, small and
 * quiet; not a button and not a filter (use Chips to filter).
 *
 * - `onDismiss` adds a remove button after the label, named "Remove {label}"
 *   (or `dismissLabel`). Its target is 24px, bigger than it looks.
 * - `strong` shows it in full ink, to set one tag apart: "Live" among "Soon".
 * - In a TagList, removing a tag moves focus to the next tag's remove button
 *   (or the previous one, or `emptyFocus` when none are left) and says
 *   "Removed {label}" politely, so keyboard users never lose their place.
 */
export interface TagProps {
  children: ReactNode;
  /** Show a remove button; called when it's pressed */
  onDismiss?: () => void;
  /** Names the remove button; default "Remove {children}" */
  dismissLabel?: string;
  strong?: boolean;
  className?: string;
}

const X = <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 2l6 6M8 2 2 8" /></svg>;

export function Tag({ children, onDismiss, dismissLabel, strong, className = '' }: TagProps) {
  const cls = ['tag', strong && 'tag--strong', onDismiss && 'tag--dismissible', className].filter(Boolean).join(' ');
  const name = dismissLabel ?? `Remove ${typeof children === 'string' ? children : 'tag'}`;
  return (
    <span className={cls}>
      <span className="tag__label">{children}</span>
      {onDismiss && <button type="button" className="tag__dismiss" aria-label={name} onClick={onDismiss}>{X}</button>}
    </span>
  );
}

export interface TagListProps {
  /** Names the list for screen readers: "Skills" */
  label: string;
  tags: string[];
  /** Makes the tags removable */
  onRemove?: (tag: string) => void;
  /** Where focus goes when the last tag is removed, e.g. the field that adds tags */
  emptyFocus?: RefObject<HTMLElement | null>;
  /** Shown when there are no tags */
  empty?: ReactNode;
  className?: string;
}

export function TagList({ label, tags, onRemove, emptyFocus, empty, className = '' }: TagListProps) {
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
        <ul ref={list} className="tag-list__items" aria-label={label}>
          {tags.map((t, i) => (
            <li key={t}><Tag onDismiss={onRemove ? () => remove(t, i) : undefined}>{t}</Tag></li>
          ))}
        </ul>
      ) : empty ? <p className="tag-list__empty">{empty}</p> : null}
      <span className="visually-hidden" role="status" id={`${id}-s`}>{said}</span>
    </div>
  );
}
