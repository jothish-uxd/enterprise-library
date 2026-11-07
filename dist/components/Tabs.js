import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { useTooltip } from './Tooltip';
export function Tabs({ label, tabs, value, onChange, activation = 'automatic', size = 'md', fill, className = '', }) {
    const id = useId();
    const refs = useRef([]);
    const onKey = (e, i) => {
        const last = tabs.length - 1;
        const to = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
            : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
                : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
        if (to < 0)
            return;
        e.preventDefault();
        refs.current[to]?.focus();
        if (activation === 'automatic' && !tabs[to].disabled)
            onChange(tabs[to].value);
    };
    const cls = ['tabs', size === 'sm' && 'tabs--sm', fill && 'tabs--fill', className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, children: [_jsx("div", { className: "tabs__list", role: "tablist", "aria-label": label, children: tabs.map((t, i) => (_jsx(Tab, { tab: t, selected: t.value === value, tabId: `${id}-t-${i}`, panelId: `${id}-p-${i}`, refFn: (el) => { refs.current[i] = el; }, onChoose: () => { if (!t.disabled)
                        onChange(t.value); }, onKeyDown: (e) => onKey(e, i) }, t.value))) }), tabs.map((t, i) => (_jsx("div", { className: "tabs__panel", role: "tabpanel", id: `${id}-p-${i}`, "aria-labelledby": `${id}-t-${i}`, hidden: t.value !== value, tabIndex: 0, children: t.panel }, t.value)))] }));
}
function Tab({ tab: t, selected, tabId, panelId, refFn, onChoose, onKeyDown }) {
    const reason = t.disabled ? t.disabledReason : undefined;
    const tip = useTooltip(reason ?? null);
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ref: (el) => { refFn(el); tip.anchorRef.current = el; }, type: "button", role: "tab", id: tabId, className: "tabs__tab", "aria-selected": selected, "aria-controls": panelId, "aria-disabled": t.disabled || undefined, "aria-describedby": reason ? tip.describedBy : undefined, tabIndex: selected ? 0 : -1, onClick: onChoose, onKeyDown: (e) => {
                    if ((e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onChoose();
                        return;
                    }
                    onKeyDown(e);
                }, ...tip.hoverProps, ...tip.focusProps, children: [_jsx("span", { className: "tabs__label", children: t.label }), t.count !== undefined && _jsx("span", { className: "tabs__count", children: t.count.toLocaleString('en-US') })] }), tip.tooltip] }));
}
