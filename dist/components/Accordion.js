import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { useTooltip } from './Tooltip';
export function Accordion({ items, open: openProp, defaultOpen = [], onOpenChange, single, headingLevel = 3, layout = 'joined', className = '', }) {
    const id = useId();
    const [own, setOwn] = useState(defaultOpen);
    const open = openProp ?? own;
    const refs = useRef([]);
    const toggle = (v, to) => {
        const isOpen = open.includes(v);
        const want = to ?? !isOpen;
        if (want === isOpen)
            return;
        const next = want ? (single ? [v] : [...open, v]) : open.filter((x) => x !== v);
        if (openProp === undefined)
            setOwn(next);
        onOpenChange?.(next);
    };
    const onKey = (e, i) => {
        const last = items.length - 1;
        const to = e.key === 'ArrowDown' ? (i === last ? 0 : i + 1)
            : e.key === 'ArrowUp' ? (i === 0 ? last : i - 1)
                : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1;
        if (to < 0)
            return;
        e.preventDefault();
        refs.current[to]?.focus();
    };
    const cls = ['accordion', layout === 'separate' && 'accordion--separate', className].filter(Boolean).join(' ');
    return (_jsx("div", { className: cls, children: items.map((item, i) => (_jsx(Section, { item: item, isOpen: open.includes(item.value) && !item.disabled, headId: `${id}-h-${i}`, panelId: `${id}-p-${i}`, level: headingLevel, region: items.length <= 6, refFn: (el) => { refs.current[i] = el; }, onToggle: (to) => { if (!item.disabled)
                toggle(item.value, to); }, onKeyDown: (e) => onKey(e, i) }, item.value))) }));
}
const CHEVRON = (_jsx("svg", { className: "accordion__chevron", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M6.5 4.5 10 8l-3.5 3.5" }) }));
function Section({ item, isOpen, headId, panelId, level, region, refFn, onToggle, onKeyDown }) {
    const reason = item.disabled ? item.disabledReason : undefined;
    const tip = useTooltip(reason ?? null);
    const panel = useRef(null);
    const Heading = `h${level}`;
    // hidden="until-found": closed but searchable; find-in-page opens it.
    // React 18 treats `hidden` as a boolean, so set the attribute directly.
    useLayoutEffect(() => {
        const el = panel.current;
        if (!el)
            return;
        if (isOpen)
            el.removeAttribute('hidden');
        else
            el.setAttribute('hidden', 'until-found');
        const reveal = () => onToggle(true);
        el.addEventListener('beforematch', reveal);
        return () => el.removeEventListener('beforematch', reveal);
    });
    const cls = ['accordion__item', isOpen && 'is-open', item.disabled && 'is-disabled'].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, children: [_jsxs("div", { className: "accordion__head", children: [_jsx(Heading, { className: "accordion__heading", children: _jsxs("button", { ref: (el) => { refFn(el); tip.anchorRef.current = el; }, type: "button", id: headId, className: "accordion__trigger", "aria-expanded": isOpen, "aria-controls": panelId, "aria-disabled": item.disabled || undefined, "aria-describedby": reason ? tip.describedBy : undefined, onClick: () => onToggle(), onKeyDown: onKeyDown, ...tip.hoverProps, ...tip.focusProps, children: [CHEVRON, _jsx("span", { className: "accordion__title", children: item.title })] }) }), item.meta && _jsx("div", { className: "accordion__meta", children: item.meta }), item.actions && _jsx("div", { className: "accordion__actions", children: item.actions })] }), tip.tooltip, _jsx("div", { ref: panel, id: panelId, className: "accordion__panel", role: region ? 'region' : undefined, "aria-labelledby": region ? headId : undefined, children: _jsx("div", { className: "accordion__body", children: item.content }) })] }));
}
