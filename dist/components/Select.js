import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTooltip } from './Tooltip';
const ErrorIcon = () => (_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }));
/**
 * Custom dropdown in the a11y-charts style (WAI-ARIA "select-only combobox").
 * The button keeps focus; the list is announced through aria-activedescendant.
 * Keys: Enter, Space, Alt+Down or Down to open; Up/Down, Home/End and typing to move;
 * Enter or Space to choose; Escape to close without choosing; Tab chooses and moves on.
 *
 * Field parts, as on Input: description under the field; error replaces it with
 * the error icon and sets aria-invalid; required adds an asterisk after the
 * label (hidden from screen readers, which hear "required" from aria-required);
 * disabled uses aria-disabled, so the button stays in the Tab order, won't
 * open or change, and disabledReason shows why in a tooltip on hover and focus.
 * describedBy and invalid still work for help and errors kept outside the field.
 */
export default function Select({ label, value, options, onChange, className, describedBy, inline, hideLabel, placeholder, invalid, buttonId, description, error, required, disabled, disabledReason, }) {
    const id = useId();
    const tip = useTooltip(disabled ? disabledReason : null);
    const ids = [error ? `${id}-err` : description ? `${id}-desc` : null, describedBy, tip.describedBy].filter(Boolean).join(' ') || undefined;
    const [open, setOpen] = useState(false);
    const found = options.findIndex((o) => o.value === value);
    const selected = Math.max(0, found);
    const [active, setActive] = useState(selected);
    const [above, setAbove] = useState(false);
    const wrapRef = useRef(null);
    const buttonRef = useRef(null);
    const listRef = useRef(null);
    const typed = useRef({ text: '', at: 0 });
    const openList = (at = selected) => { setActive(at); setOpen(true); };
    const choose = (i) => { onChange(options[i].value); setOpen(false); };
    // Close on outside click.
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => { if (!wrapRef.current?.contains(e.target))
            setOpen(false); };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);
    // Open upward when there isn't room below inside the scrolling area.
    useLayoutEffect(() => {
        if (!open || !buttonRef.current || !listRef.current)
            return;
        const scroller = buttonRef.current.closest('[data-scroll]') ?? document.documentElement;
        const b = buttonRef.current.getBoundingClientRect();
        const area = scroller.getBoundingClientRect();
        const h = listRef.current.offsetHeight;
        setAbove(b.bottom + h + 8 > area.bottom && b.top - h - 8 > area.top);
    }, [open]);
    // Keep the active option in view.
    useEffect(() => {
        if (open)
            listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [open, active]);
    const onKeyDown = (e) => {
        const last = options.length - 1;
        if (!open) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                openList(e.key === 'ArrowUp' ? Math.max(0, selected - 1) : selected);
            }
            else if (e.key === 'Home' || e.key === 'End') {
                e.preventDefault();
                openList(e.key === 'Home' ? 0 : last);
            }
            else if (e.key.length === 1) {
                typeahead(e.key, true);
            }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActive((a) => Math.min(last, a + 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (e.altKey)
                    choose(active);
                else
                    setActive((a) => Math.max(0, a - 1));
                break;
            case 'Home':
                e.preventDefault();
                setActive(0);
                break;
            case 'End':
                e.preventDefault();
                setActive(last);
                break;
            case 'PageDown':
                e.preventDefault();
                setActive((a) => Math.min(last, a + 10));
                break;
            case 'PageUp':
                e.preventDefault();
                setActive((a) => Math.max(0, a - 10));
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                choose(active);
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                break;
            case 'Tab':
                choose(active);
                break;
            default: if (e.key.length === 1)
                typeahead(e.key, false);
        }
    };
    const typeahead = (ch, wasClosed) => {
        const now = Date.now();
        const t = typed.current;
        t.text = now - t.at > 600 ? ch.toLowerCase() : t.text + ch.toLowerCase();
        t.at = now;
        const start = wasClosed ? selected : active;
        const order = [...options.keys()].map((k) => (start + 1 + k) % options.length);
        const hit = order.find((i) => options[i].label.toLowerCase().startsWith(t.text))
            ?? (t.text.length > 1 ? options.findIndex((o) => o.label.toLowerCase().startsWith(t.text)) : -1);
        if (hit === undefined || hit < 0)
            return;
        if (wasClosed)
            onChange(options[hit].value);
        else
            setActive(hit);
    };
    return (_jsxs("div", { className: `field select${inline ? ' field--inline' : ''}${disabled ? ' is-disabled' : ''}${className ? ` ${className}` : ''}`, ref: wrapRef, ...tip.hoverProps, children: [_jsxs("span", { className: hideLabel ? 'visually-hidden' : 'field__label', id: `${id}-label`, children: [label, required && _jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" })] }), _jsxs("div", { className: "select__anchor", children: [_jsxs("button", { ref: (el) => { buttonRef.current = el; tip.anchorRef.current = el; }, id: buttonId, type: "button", role: "combobox", className: "select__button", "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": `${id}-list`, "aria-labelledby": `${id}-label`, "aria-describedby": ids, "aria-invalid": invalid || error ? true : undefined, "aria-required": required || undefined, "aria-disabled": disabled || undefined, "aria-activedescendant": open ? `${id}-opt-${active}` : undefined, onClick: () => { if (disabled)
                            return; if (open)
                            setOpen(false);
                        else
                            openList(); }, onKeyDown: (e) => { if (!disabled)
                            onKeyDown(e); }, onFocus: tip.focusProps.onFocus, onBlur: (e) => { tip.focusProps.onBlur(); if (!wrapRef.current?.contains(e.relatedTarget))
                            setOpen(false); }, children: [_jsx("span", { className: `select__value${found < 0 && placeholder ? ' is-placeholder' : ''}`, children: found < 0 && placeholder ? placeholder : options[selected]?.label }), _jsx("svg", { className: "select__chevron", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "m4 6 4 4 4-4" }) })] }), _jsx("ul", { ref: listRef, id: `${id}-list`, role: "listbox", "aria-labelledby": `${id}-label`, tabIndex: -1, className: `select__list${above ? ' is-above' : ''}`, hidden: !open, children: options.map((o, i) => (_jsxs("li", { id: `${id}-opt-${i}`, "data-index": i, role: "option", "aria-selected": i === found, className: `select__option${i === active ? ' is-active' : ''}`, onMouseMove: () => setActive(i), onMouseDown: (e) => e.preventDefault(), onClick: () => { choose(i); buttonRef.current?.focus(); }, children: [_jsx("span", { children: o.label }), _jsx("svg", { className: "select__check", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "m3.5 8.5 3 3 6-7" }) })] }, String(o.value)))) })] }), error
                ? _jsxs("span", { className: "field-error", id: `${id}-err`, children: [_jsx(ErrorIcon, {}), error] })
                : description ? _jsx("span", { className: "field-help", id: `${id}-desc`, children: description }) : null, tip.tooltip] }));
}
