import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
export function Menu({ label, items, children, iconOnly, variant = 'secondary', size = 'md', align = 'end', className = '', }) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [above, setAbove] = useState(false);
    const btn = useRef(null);
    const list = useRef(null);
    const typed = useRef({ text: '', at: 0 });
    const all = items.map((_, i) => i);
    useLayoutEffect(() => {
        if (!open || !btn.current || !list.current) {
            setAbove(false);
            return;
        }
        const b = btn.current.getBoundingClientRect();
        const h = list.current.offsetHeight;
        const scroller = btn.current.closest('[data-scroll]');
        const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
        const top = scroller ? scroller.getBoundingClientRect().top : 0;
        setAbove(b.bottom + 6 + h > bottom && b.top - 6 - h > top);
    }, [open]);
    useEffect(() => {
        if (!open)
            return;
        list.current?.querySelector(`[data-i="${active}"]`)?.focus();
    }, [open, active]);
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (!list.current?.contains(e.target) && !btn.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);
    const openAt = (where) => { setActive(where === 'first' ? 0 : items.length - 1); setOpen(true); };
    const close = (refocus = true) => { setOpen(false); if (refocus)
        btn.current?.focus(); };
    const step = (d) => setActive((a) => (a + d + items.length) % items.length);
    const choose = (it) => { if (it.disabled)
        return; close(); it.onSelect(); };
    const typeahead = (key) => {
        const now = Date.now();
        typed.current = { text: (now - typed.current.at > 600 ? '' : typed.current.text) + key.toLowerCase(), at: now };
        const t = typed.current.text;
        const order = [...all.slice(active + 1), ...all.slice(0, active + 1)];
        const hit = order.find((i) => items[i].label.toLowerCase().startsWith(t))
            ?? order.find((i) => items[i].label.toLowerCase().startsWith(t[0]));
        if (hit !== undefined)
            setActive(hit);
    };
    const btnCls = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', iconOnly && 'btn--icon', 'menu__button'].filter(Boolean).join(' ');
    return (_jsxs("span", { className: ['menu', className].filter(Boolean).join(' '), children: [_jsx("button", { ref: btn, type: "button", className: btnCls, "aria-label": label, "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `${id}-m` : undefined, onClick: () => (open ? close() : openAt('first')), onKeyDown: (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        openAt('first');
                    }
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        openAt('last');
                    }
                }, children: children }), open && (_jsx("ul", { ref: list, id: `${id}-m`, role: "menu", "aria-label": label, className: `menu__list menu__list--${align}${above ? ' is-above' : ''}`, onKeyDown: (e) => {
                    switch (e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            step(1);
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            step(-1);
                            break;
                        case 'Home':
                            e.preventDefault();
                            setActive(0);
                            break;
                        case 'End':
                            e.preventDefault();
                            setActive(items.length - 1);
                            break;
                        case 'Escape':
                            e.preventDefault();
                            close();
                            break;
                        case 'Tab':
                            close(false);
                            break;
                        default: if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey)
                            typeahead(e.key);
                    }
                }, children: items.map((it, i) => (_jsxs("li", { role: "menuitem", "data-i": i, tabIndex: i === active ? 0 : -1, "aria-disabled": it.disabled || undefined, "aria-describedby": it.disabled && it.disabledReason ? `${id}-r${i}` : undefined, className: ['menu__item', it.divider && 'has-divider', it.danger && 'is-danger'].filter(Boolean).join(' '), onClick: () => choose(it), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        choose(it);
                    } }, children: [it.icon && _jsx("span", { className: "menu__icon", "aria-hidden": "true", children: it.icon }), _jsxs("span", { className: "menu__text", children: [_jsx("span", { className: "menu__label", children: it.label }), it.disabled && it.disabledReason && _jsx("span", { className: "menu__reason", id: `${id}-r${i}`, children: it.disabledReason })] })] }, it.label))) }))] }));
}
