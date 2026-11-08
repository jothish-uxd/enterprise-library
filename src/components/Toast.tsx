import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode,
} from 'react';
import { AlertIcon, CLOSE_ICON, TONE_WORD, type AlertTone } from './AlertIcon';

/**
 * Toast — a short result of something people just did ("Assessment
 * duplicated"), shown at the bottom corner and gone after a while. For problems
 * that need attention, use a Banner.
 *
 * Wrap the app in <ToastProvider>, then call `toast()` from useToast():
 *   const { toast } = useToast();
 *   toast({ message: 'Assessment duplicated', action: { label: 'Undo', onClick: undo } });
 *
 * - Announced politely, once, through one live region; focus stays where it is.
 * - Toasts sit in a region named "Notifications", so screen reader users can
 *   jump to it from the landmarks list.
 * - A toast with an action stays until dismissed. Others stay `duration`
 *   (at least 6 seconds), and pause while the pointer is over them or focus is
 *   in them.
 * - At most `max` (3) show at once; the rest collapse into a "2 more" button.
 * - Escape or the close button dismisses one. If focus was in it, it goes back
 *   to where it was before it moved into the toasts.
 * - tone: info (default), success or error, each with its own icon shape and a
 *   word for screen readers. Toasts are ink, whatever the tone.
 */
export interface ToastOptions {
  message: ReactNode;
  tone?: Exclude<AlertTone, 'warning'>;
  /** One action, such as Undo. The toast then stays until dismissed. */
  action?: { label: string; onClick: () => void };
  /** How long it stays, in ms (at least 6000) */
  duration?: number;
}

interface ToastItem extends ToastOptions { id: number }

interface ToastApi {
  toast: (t: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useToast needs a <ToastProvider> above it');
  return api;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Names the region (default "Notifications") */
  label?: string;
  /** How many show at once (default 3) */
  max?: number;
  className?: string;
}

const MIN = 6000;
let next = 1;

export function ToastProvider({ children, label = 'Notifications', max = 3, className = '' }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [said, setSaid] = useState('');
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const region = useRef<HTMLElement>(null);
  const before = useRef<HTMLElement | null>(null);

  const dismiss = useCallback((id: number) => {
    const inside = region.current?.contains(document.activeElement);
    setItems((all) => all.filter((t) => t.id !== id));
    // A removed element doesn't fire blur, so leave the paused state here
    if (inside) { setFocusIn(false); requestAnimationFrame(() => { before.current?.focus?.(); }); }
  }, []);

  const toast = useCallback((t: ToastOptions) => {
    const id = next++;
    setItems((all) => [...all, { ...t, id }]);
    // Clear, then set, so the same words are announced again
    setSaid('');
    const text = typeof t.message === 'string' ? t.message : '';
    setTimeout(() => setSaid(`${t.tone && t.tone !== 'info' ? `${TONE_WORD[t.tone]}: ` : ''}${text}${t.action ? `. ${t.action.label} is available in Notifications.` : ''}`), 50);
    return id;
  }, []);

  useEffect(() => { if (items.length <= max) setExpanded(false); }, [items.length, max]);

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const paused = hover || focusIn;
  const shown = expanded ? items : items.slice(-max);
  const more = items.length - shown.length;

  return (
    <Ctx.Provider value={api}>
      {children}
      <section
        ref={region}
        className={['toaster', className].filter(Boolean).join(' ')}
        aria-label={label}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={(e) => {
          if (!region.current?.contains(e.relatedTarget as Node)) before.current = e.relatedTarget as HTMLElement | null;
          setFocusIn(true);
        }}
        onBlur={(e) => { if (!region.current?.contains(e.relatedTarget as Node)) setFocusIn(false); }}
      >
        {more > 0 && (
          <button type="button" className="toaster__more" onClick={() => setExpanded(true)}>
            {more} more
          </button>
        )}
        {items.length > 0 && (
          <ol className="toaster__list">
            {shown.map((t) => <Toast key={t.id} item={t} paused={paused} onDismiss={() => dismiss(t.id)} />)}
          </ol>
        )}
        <div className="visually-hidden" role="status" aria-live="polite">{said}</div>
      </section>
    </Ctx.Provider>
  );
}

function Toast({ item, paused, onDismiss }: { item: ToastItem; paused: boolean; onDismiss: () => void }) {
  const tone = item.tone ?? 'info';
  const left = useRef(Math.max(MIN, item.duration ?? MIN));

  useEffect(() => {
    if (item.action || paused) return;
    const start = Date.now();
    const timer = setTimeout(onDismiss, left.current);
    return () => { clearTimeout(timer); left.current = Math.max(1500, left.current - (Date.now() - start)); };
  }, [paused, item.action, onDismiss]);

  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onDismiss(); } };
  return (
    <li className={`toaster__toast toaster__toast--${tone}`} onKeyDown={onKey}>
      <AlertIcon tone={tone} />
      <p className="toaster__message">
        {tone !== 'info' && <span className="visually-hidden">{TONE_WORD[tone]}: </span>}
        {item.message}
      </p>
      {item.action && (
        <button type="button" className="toaster__action" onClick={() => { item.action!.onClick(); onDismiss(); }}>
          {item.action.label}
        </button>
      )}
      <button type="button" className="toaster__close" aria-label="Dismiss" onClick={onDismiss}>{CLOSE_ICON}</button>
    </li>
  );
}
