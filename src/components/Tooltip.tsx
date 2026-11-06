import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip — extra detail beside something on the page. Two versions:
 *
 * trigger="hover" (default): opens on hover or keyboard focus. Text only.
 * - The trigger is a real button with its own name; the tooltip is linked with
 *   aria-describedby (role="tooltip"), so screen readers hear it on focus.
 * - WCAG 1.4.13: hoverable (the pointer can move onto it), dismissable
 *   (Escape closes it without moving focus) and persistent (it stays until
 *   the pointer or focus leaves).
 * - Never put links or buttons in it: it closes as soon as focus moves, so
 *   keyboard and screen reader users could never reach them.
 *
 * trigger="click": opens and closes when the button is pressed. Can hold links.
 * - A disclosure: the button says expanded or collapsed. The panel is a native
 *   popover, so it sits above everything (no clipping), Escape and clicking
 *   outside close it, and Tab moves from the button straight into its links.
 * - Escape returns focus to the button.
 *
 * Both render outside the page flow and position themselves against the
 * trigger, flipping above when there's no room below.
 */
interface Props {
  /** Accessible name of the trigger, e.g. "3 policy matches" or "About proctoring" */
  label: string;
  /** What the trigger shows */
  children: ReactNode;
  /** Tooltip content. Hover: text only. Click: may include links and buttons. */
  content: ReactNode;
  /** How it opens. Default 'hover'. */
  trigger?: 'hover' | 'click';
  className?: string;
  /** Hover only: pass clicks on to a parent (e.g. a table row) */
  onClick?: () => void;
}

const SHOW_DELAY = 150;
const HIDE_DELAY = 120;
const GAP = 8;

type Pos = { top: number; left: number; arrow: number; above: boolean };

function place(trigger: HTMLElement, panel: HTMLElement): Pos {
  const t = trigger.getBoundingClientRect();
  const c = panel.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const above = t.bottom + GAP + c.height > vh - 8 && t.top - GAP - c.height > 8;
  const centre = t.left + t.width / 2;
  const left = Math.min(Math.max(8, centre - c.width / 2), vw - c.width - 8);
  return { top: above ? t.top - GAP - c.height : t.bottom + GAP, left, arrow: centre - left, above };
}

export function Tooltip(props: Props) {
  return props.trigger === 'click' ? <ClickTooltip {...props} /> : <HoverTooltip {...props} />;
}

/**
 * useTooltip — the hover tooltip's behaviour, for any control that needs one,
 * e.g. explaining why a switch or button is unavailable.
 * Spread `hoverProps` on the area people point at, `focusProps` on the element
 * that takes focus, put `describedBy` in its aria-describedby, attach `anchorRef`
 * to what the arrow should point at, and render `tooltip`.
 * Screen readers hear the text on focus whether or not it's showing.
 */
export function useTooltip(content: ReactNode) {
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  const clear = () => window.clearTimeout(timer.current);
  const show = (delay = SHOW_DELAY) => { clear(); timer.current = window.setTimeout(() => setOpen(true), delay); };
  const hide = (delay = HIDE_DELAY) => { clear(); timer.current = window.setTimeout(() => setOpen(false), delay); };
  useEffect(() => clear, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { clear(); setOpen(false); } };
    const onScroll = () => setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('scroll', onScroll, true); };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !panelRef.current) { setPos(null); return; }
    setPos(place(anchorRef.current, panelRef.current));
  }, [open]);

  const tooltip = content == null ? null : createPortal(
    <div
      ref={panelRef}
      id={id}
      role="tooltip"
      className={`tooltip${pos?.above ? ' is-above' : ''}`}
      hidden={!open}
      style={pos ? { top: pos.top, left: pos.left, ['--arrow-x' as string]: `${pos.arrow}px` } : { visibility: 'hidden' }}
      onMouseEnter={() => clear()}
      onMouseLeave={() => hide()}
    >
      {content}
    </div>,
    document.body,
  );

  return {
    describedBy: content == null ? undefined : id,
    anchorRef,
    hoverProps: { onMouseEnter: () => show(), onMouseLeave: () => hide() },
    focusProps: { onFocus: () => show(0), onBlur: () => hide(0) },
    tooltip,
  };
}

function HoverTooltip({ label, children, content, className, onClick }: Props) {
  const tip = useTooltip(content);
  return (
    <>
      <button
        ref={(el) => { tip.anchorRef.current = el; }}
        type="button"
        className={`tooltip-trigger${className ? ` ${className}` : ''}`}
        aria-label={label}
        aria-describedby={tip.describedBy}
        {...tip.hoverProps}
        {...tip.focusProps}
        onClick={onClick}
      >
        {children}
      </button>
      {tip.tooltip}
    </>
  );
}

function ClickTooltip({ label, children, content, className }: Props) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  const reposition = useCallback(() => {
    if (triggerRef.current && panelRef.current) setPos(place(triggerRef.current, panelRef.current));
  }, []);

  // The native popover owns opening, light dismiss and Escape; mirror its state.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onToggle = (e: Event) => {
      const isOpen = (e as Event & { newState?: string }).newState === 'open';
      setOpen(isOpen);
      if (!isOpen) setPos(null);
    };
    panel.addEventListener('toggle', onToggle);
    return () => panel.removeEventListener('toggle', onToggle);
  }, []);

  useLayoutEffect(() => { if (open) reposition(); }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // Escape closes the popover natively; put focus back on the button.
      if (e.key === 'Escape' && panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', reposition);
    document.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', reposition);
      document.removeEventListener('scroll', reposition, true);
    };
  }, [open, reposition]);

  const popoverAttrs = { popover: 'auto' } as Record<string, string>;
  const targetAttrs = { popovertarget: id } as Record<string, string>;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`tooltip-trigger${className ? ` ${className}` : ''}`}
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        {...targetAttrs}
      >
        {children}
      </button>
      <div
        ref={panelRef}
        id={id}
        className={`tooltip tooltip--click${pos?.above ? ' is-above' : ''}`}
        aria-label={label}
        role="group"
        style={pos ? { top: pos.top, left: pos.left, ['--arrow-x' as string]: `${pos.arrow}px` } : { visibility: 'hidden' }}
        {...popoverAttrs}
      >
        {content}
      </div>
    </>
  );
}

/** @deprecated Use Tooltip (trigger="hover"). Kept so 0.1 apps keep working. */
export function HoverCard({ card, ...rest }: Omit<Props, 'content' | 'trigger'> & { card: ReactNode }) {
  return <Tooltip {...rest} content={card} />;
}
