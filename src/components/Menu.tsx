import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Menu — a button that opens a short list of actions (WAI-ARIA menu button).
 * For actions on one thing ("Options for Pilot screening v3"), not for
 * navigation (use links) or for choosing a value (use Select).
 *
 * - The button says it has a menu and whether it's open: "Options for Pilot
 *   screening v3, menu button, collapsed".
 * - Opening moves focus into the menu. Up and Down move (and wrap), Home and End
 *   jump, typing a letter jumps to the next item starting with it, Enter or
 *   Space chooses, Escape closes and returns focus to the button, Tab closes
 *   and moves on.
 * - An unavailable item stays in the arrow-key order and says why under its
 *   label, read as its description; choosing it does nothing.
 * - danger: for an action that destroys something. It's set in medium ink
 *   weight after a rule; ask for confirmation in a Dialog before doing it.
 * - The list opens below the button, or above it when there's no room.
 */
export interface MenuItem {
  label: string;
  onSelect: () => void;
  /** A small icon before the label; decorative */
  icon?: ReactNode;
  /** Can't be chosen right now; stays reachable. Give a reason. */
  disabled?: boolean;
  disabledReason?: string;
  /** Draws a rule above this item, to start a new group */
  divider?: boolean;
  /** Destroys something; confirm in a Dialog before doing it */
  danger?: boolean;
}

export interface MenuProps {
  /** The button's name, e.g. "Options for Pilot screening v3" */
  label: string;
  items: MenuItem[];
  /** What the button shows: text, an icon, or both */
  children: ReactNode;
  /** Icon-only button: square, with label as its name */
  iconOnly?: boolean;
  variant?: 'secondary' | 'ghost' | 'primary';
  size?: 'sm' | 'md';
  /** Line the list up with the button's start or end edge. Default 'end'. */
  align?: 'start' | 'end';
  className?: string;
}

export function Menu({
  label, items, children, iconOnly, variant = 'secondary', size = 'md', align = 'end', className = '',
}: MenuProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [above, setAbove] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const all = items.map((_, i) => i);

  useLayoutEffect(() => {
    if (!open || !btn.current || !list.current) { setAbove(false); return; }
    const b = btn.current.getBoundingClientRect();
    const h = list.current.offsetHeight;
    const scroller = btn.current.closest('[data-scroll]');
    const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
    const top = scroller ? scroller.getBoundingClientRect().top : 0;
    setAbove(b.bottom + 6 + h > bottom && b.top - 6 - h > top);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    (list.current?.querySelector(`[data-i="${active}"]`) as HTMLElement | null)?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!list.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const openAt = (where: 'first' | 'last') => { setActive(where === 'first' ? 0 : items.length - 1); setOpen(true); };
  const close = (refocus = true) => { setOpen(false); if (refocus) btn.current?.focus(); };
  const step = (d: 1 | -1) => setActive((a) => (a + d + items.length) % items.length);
  const choose = (it: MenuItem) => { if (it.disabled) return; close(); it.onSelect(); };
  const typeahead = (key: string) => {
    const now = Date.now();
    typed.current = { text: (now - typed.current.at > 600 ? '' : typed.current.text) + key.toLowerCase(), at: now };
    const t = typed.current.text;
    const order = [...all.slice(active + 1), ...all.slice(0, active + 1)];
    const hit = order.find((i) => items[i].label.toLowerCase().startsWith(t))
      ?? order.find((i) => items[i].label.toLowerCase().startsWith(t[0]));
    if (hit !== undefined) setActive(hit);
  };

  const btnCls = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', iconOnly && 'btn--icon', 'menu__button'].filter(Boolean).join(' ');
  return (
    <span className={['menu', className].filter(Boolean).join(' ')}>
      <button
        ref={btn}
        type="button"
        className={btnCls}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-m` : undefined}
        onClick={() => (open ? close() : openAt('first'))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); openAt('first'); }
          if (e.key === 'ArrowUp') { e.preventDefault(); openAt('last'); }
        }}
      >
        {children}
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-m`}
          role="menu"
          aria-label={label}
          className={`menu__list menu__list--${align}${above ? ' is-above' : ''}`}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'ArrowDown': e.preventDefault(); step(1); break;
              case 'ArrowUp': e.preventDefault(); step(-1); break;
              case 'Home': e.preventDefault(); setActive(0); break;
              case 'End': e.preventDefault(); setActive(items.length - 1); break;
              case 'Escape': e.preventDefault(); close(); break;
              case 'Tab': close(false); break;
              default: if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) typeahead(e.key);
            }
          }}
        >
          {items.map((it, i) => (
            <li
              key={it.label}
              role="menuitem"
              data-i={i}
              tabIndex={i === active ? 0 : -1}
              aria-disabled={it.disabled || undefined}
              aria-describedby={it.disabled && it.disabledReason ? `${id}-r${i}` : undefined}
              className={['menu__item', it.divider && 'has-divider', it.danger && 'is-danger'].filter(Boolean).join(' ')}
              onClick={() => choose(it)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(it); } }}
            >
              {it.icon && <span className="menu__icon" aria-hidden="true">{it.icon}</span>}
              <span className="menu__text">
                <span className="menu__label">{it.label}</span>
                {it.disabled && it.disabledReason && <span className="menu__reason" id={`${id}-r${i}`}>{it.disabledReason}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
