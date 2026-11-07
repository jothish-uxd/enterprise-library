import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

/**
 * Tabs — switch between panels of related content in one place, such as a
 * record's Overview, Activity and Settings (WAI-ARIA tabs). Not for moving
 * between pages (use links or the side navigation) or for filtering one list
 * (use a SegmentedControl).
 *
 * - The list is named by `label`; each tab says its place and whether it's
 *   chosen: "Activity, tab, selected, 2 of 3". Its panel is named by the tab.
 * - Tab moves into the list (onto the chosen tab), then on into the panel.
 *   Left and Right move between tabs and wrap; Home and End jump.
 *   activation 'automatic' (default) shows a panel as soon as its tab is
 *   reached; 'manual' waits for Enter or Space, for panels that are slow to load.
 * - An unavailable tab uses aria-disabled: the arrow keys still reach it, it
 *   can't be chosen, and disabledReason says why in a tooltip and as its description.
 * - The chosen tab is marked with full ink and a 2px rule under it, never colour.
 * - All panels stay mounted (hidden) so what people typed survives switching.
 */
export interface TabItem<V extends string = string> {
  value: V;
  label: string;
  /** A count after the label, e.g. open items */
  count?: number;
  /** The panel shown when this tab is chosen */
  panel: ReactNode;
  /** Can't be chosen right now; stays reachable. Give a reason. */
  disabled?: boolean;
  disabledReason?: string;
}

export interface TabsProps<V extends string = string> {
  /** Names the tab list for screen readers, e.g. "Assessment sections" */
  label: string;
  tabs: TabItem<V>[];
  value: V;
  onChange: (value: V) => void;
  /** 'automatic' (default): arrows choose. 'manual': arrows move, Enter or Space chooses. */
  activation?: 'automatic' | 'manual';
  size?: 'sm' | 'md';
  /** Tabs share the width equally */
  fill?: boolean;
  className?: string;
}

export function Tabs<V extends string = string>({
  label, tabs, value, onChange, activation = 'automatic', size = 'md', fill, className = '',
}: TabsProps<V>) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const to = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
    if (to < 0) return;
    e.preventDefault();
    refs.current[to]?.focus();
    if (activation === 'automatic' && !tabs[to].disabled) onChange(tabs[to].value);
  };

  const cls = ['tabs', size === 'sm' && 'tabs--sm', fill && 'tabs--fill', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="tabs__list" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <Tab key={t.value} tab={t} selected={t.value === value} tabId={`${id}-t-${i}`} panelId={`${id}-p-${i}`}
            refFn={(el) => { refs.current[i] = el; }}
            onChoose={() => { if (!t.disabled) onChange(t.value); }} onKeyDown={(e) => onKey(e, i)} />
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.value} className="tabs__panel" role="tabpanel" id={`${id}-p-${i}`} aria-labelledby={`${id}-t-${i}`}
          hidden={t.value !== value} tabIndex={0}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}

function Tab<V extends string>({ tab: t, selected, tabId, panelId, refFn, onChoose, onKeyDown }: {
  tab: TabItem<V>; selected: boolean; tabId: string; panelId: string;
  refFn: (el: HTMLButtonElement | null) => void; onChoose: () => void; onKeyDown: (e: KeyboardEvent) => void;
}) {
  const reason = t.disabled ? t.disabledReason : undefined;
  const tip = useTooltip(reason ?? null);
  return (
    <>
      <button
        ref={(el) => { refFn(el); tip.anchorRef.current = el; }}
        type="button"
        role="tab"
        id={tabId}
        className="tabs__tab"
        aria-selected={selected}
        aria-controls={panelId}
        aria-disabled={t.disabled || undefined}
        aria-describedby={reason ? tip.describedBy : undefined}
        tabIndex={selected ? 0 : -1}
        onClick={onChoose}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onChoose(); return; }
          onKeyDown(e);
        }}
        {...tip.hoverProps}
        {...tip.focusProps}
      >
        <span className="tabs__label">{t.label}</span>
        {t.count !== undefined && <span className="tabs__count">{t.count.toLocaleString('en-US')}</span>}
      </button>
      {tip.tooltip}
    </>
  );
}
