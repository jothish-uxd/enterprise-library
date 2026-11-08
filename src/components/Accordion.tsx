import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

/**
 * Accordion — a stack of sections people open one or more of, so a long page
 * shows its outline first: test cases, FAQs, settings groups (WAI-ARIA
 * accordion). Not for switching between views of one thing (use Tabs) or for a
 * single show/hide (use a button with aria-expanded).
 *
 * - Each header is a heading (level `headingLevel`, default 3) holding one
 *   button: "Test case 1.2, button, collapsed". Its panel is a region named by
 *   the header (only while there are 6 sections or fewer, so landmarks don't
 *   pile up).
 * - Tab moves between headers and into an open panel; Enter or Space opens and
 *   closes. Up and Down move between headers; Home and End jump.
 * - `single` keeps one section open at a time; otherwise any number open.
 * - `meta` (a StatusMark, a count) and `actions` (icon buttons) sit beside the
 *   header button, never inside it.
 * - A section that can't open uses aria-disabled: it stays reachable, and
 *   disabledReason says why in a tooltip and as its description.
 * - Open or closed is shown by the chevron's shape, never colour. Closed panels
 *   stay mounted (hidden) so what people typed survives, and use
 *   hidden="until-found" where supported, so find-in-page opens them.
 * - layout 'joined' (default): rules between sections, for a page's flow.
 *   'separate': each section its own bordered box, for cards like test cases.
 */
export interface AccordionItem<V extends string = string> {
  value: V;
  title: ReactNode;
  /** The panel's content */
  content: ReactNode;
  /** Beside the title, outside the button: a status, a count */
  meta?: ReactNode;
  /** At the end of the header, outside the button: icon buttons */
  actions?: ReactNode;
  /** Can't be opened right now; stays reachable. Give a reason. */
  disabled?: boolean;
  disabledReason?: string;
}

export interface AccordionProps<V extends string = string> {
  items: AccordionItem<V>[];
  /** Open sections, when you control it */
  open?: V[];
  /** Open sections at first, when it controls itself */
  defaultOpen?: V[];
  onOpenChange?: (open: V[]) => void;
  /** One section open at a time */
  single?: boolean;
  /** The heading level of each header, to fit the page outline */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  layout?: 'joined' | 'separate';
  className?: string;
}

export function Accordion<V extends string = string>({
  items, open: openProp, defaultOpen = [], onOpenChange, single, headingLevel = 3, layout = 'joined', className = '',
}: AccordionProps<V>) {
  const id = useId();
  const [own, setOwn] = useState<V[]>(defaultOpen);
  const open = openProp ?? own;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (v: V, to?: boolean) => {
    const isOpen = open.includes(v);
    const want = to ?? !isOpen;
    if (want === isOpen) return;
    const next = want ? (single ? [v] : [...open, v]) : open.filter((x) => x !== v);
    if (openProp === undefined) setOwn(next);
    onOpenChange?.(next);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1;
    const to = e.key === 'ArrowDown' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowUp' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
    if (to < 0) return;
    e.preventDefault();
    refs.current[to]?.focus();
  };

  const cls = ['accordion', layout === 'separate' && 'accordion--separate', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {items.map((item, i) => (
        <Section key={item.value} item={item} isOpen={open.includes(item.value) && !item.disabled}
          headId={`${id}-h-${i}`} panelId={`${id}-p-${i}`} level={headingLevel} region={items.length <= 6}
          refFn={(el) => { refs.current[i] = el; }}
          onToggle={(to) => { if (!item.disabled) toggle(item.value, to); }} onKeyDown={(e) => onKey(e, i)} />
      ))}
    </div>
  );
}

const CHEVRON = (
  <svg className="accordion__chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M6.5 4.5 10 8l-3.5 3.5" />
  </svg>
);

function Section<V extends string>({ item, isOpen, headId, panelId, level, region, refFn, onToggle, onKeyDown }: {
  item: AccordionItem<V>; isOpen: boolean; headId: string; panelId: string; level: number; region: boolean;
  refFn: (el: HTMLButtonElement | null) => void; onToggle: (to?: boolean) => void; onKeyDown: (e: KeyboardEvent) => void;
}) {
  const reason = item.disabled ? item.disabledReason : undefined;
  const tip = useTooltip(reason ?? null);
  const panel = useRef<HTMLDivElement>(null);
  const Heading = `h${level}` as 'h3';

  // hidden="until-found": closed but searchable; find-in-page opens it.
  // React 18 treats `hidden` as a boolean, so set the attribute directly.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (isOpen) el.removeAttribute('hidden'); else el.setAttribute('hidden', 'until-found');
    const reveal = () => onToggle(true);
    el.addEventListener('beforematch', reveal);
    return () => el.removeEventListener('beforematch', reveal);
  });

  const cls = ['accordion__item', isOpen && 'is-open', item.disabled && 'is-disabled'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="accordion__head">
        <Heading className="accordion__heading">
          <button
            ref={(el) => { refFn(el); tip.anchorRef.current = el; }}
            type="button"
            id={headId}
            className="accordion__trigger"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-disabled={item.disabled || undefined}
            aria-describedby={reason ? tip.describedBy : undefined}
            onClick={() => onToggle()}
            onKeyDown={onKeyDown}
            {...tip.hoverProps}
            {...tip.focusProps}
          >
            {CHEVRON}
            <span className="accordion__title">{item.title}</span>
          </button>
        </Heading>
        {item.meta && <div className="accordion__meta">{item.meta}</div>}
        {item.actions && <div className="accordion__actions">{item.actions}</div>}
      </div>
      {tip.tooltip}
      <div ref={panel} id={panelId} className="accordion__panel" role={region ? 'region' : undefined}
        aria-labelledby={region ? headId : undefined}>
        <div className="accordion__body">{item.content}</div>
      </div>
    </div>
  );
}
