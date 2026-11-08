import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef, useState } from 'react';
const X = _jsx("svg", { viewBox: "0 0 10 10", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M2 2l6 6M8 2 2 8" }) });
export function Tag({ children, onDismiss, dismissLabel, strong, className = '' }) {
    const cls = ['tag', strong && 'tag--strong', onDismiss && 'tag--dismissible', className].filter(Boolean).join(' ');
    const name = dismissLabel ?? `Remove ${typeof children === 'string' ? children : 'tag'}`;
    return (_jsxs("span", { className: cls, children: [_jsx("span", { className: "tag__label", children: children }), onDismiss && _jsx("button", { type: "button", className: "tag__dismiss", "aria-label": name, onClick: onDismiss, children: X })] }));
}
export function TagList({ label, tags, onRemove, emptyFocus, empty, className = '' }) {
    const id = useId();
    const list = useRef(null);
    const [said, setSaid] = useState('');
    const remove = (t, i) => {
        onRemove?.(t);
        setSaid(`Removed ${t}`);
        // After the list re-renders, land on the tag that took its place
        requestAnimationFrame(() => {
            const buttons = list.current?.querySelectorAll('.tag__dismiss');
            const next = buttons && (buttons[Math.min(i, buttons.length - 1)] ?? null);
            (next ?? emptyFocus?.current ?? list.current?.closest('[tabindex]'))?.focus?.();
        });
    };
    return (_jsxs("div", { className: ['tag-list', className].filter(Boolean).join(' '), children: [tags.length > 0 ? (_jsx("ul", { ref: list, className: "tag-list__items", "aria-label": label, children: tags.map((t, i) => (_jsx("li", { children: _jsx(Tag, { onDismiss: onRemove ? () => remove(t, i) : undefined, children: t }) }, t))) })) : empty ? _jsx("p", { className: "tag-list__empty", children: empty }) : null, _jsx("span", { className: "visually-hidden", role: "status", id: `${id}-s`, children: said })] }));
}
