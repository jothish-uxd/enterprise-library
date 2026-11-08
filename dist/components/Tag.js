import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef, useState } from 'react';
import { StatusMarkIcon } from './StatusMark';
const X = _jsx("svg", { viewBox: "0 0 10 10", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M2 2l6 6M8 2 2 8" }) });
export function Tag({ children, color = 'gray', mark, onDismiss, dismissLabel, strong, className = '' }) {
    const cls = ['tag', color !== 'gray' && `tag--${color}`, strong && 'tag--strong', onDismiss && 'tag--dismissible', className].filter(Boolean).join(' ');
    const name = dismissLabel ?? `Remove ${typeof children === 'string' ? children : 'tag'}`;
    return (_jsxs("span", { className: cls, children: [mark && _jsx(StatusMarkIcon, { mark: mark, className: "tag__mark" }), _jsx("span", { className: "tag__label", children: children }), onDismiss && _jsx("button", { type: "button", className: "tag__dismiss", "aria-label": name, onClick: onDismiss, children: X })] }));
}
const labelOf = (t) => (typeof t === 'string' ? t : t.label);
export function TagList({ label, labelledBy, tags, onRemove, emptyFocus, empty, className = '' }) {
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
    return (_jsxs("div", { className: ['tag-list', className].filter(Boolean).join(' '), children: [tags.length > 0 ? (_jsx("ul", { ref: list, className: "tag-list__items", "aria-label": labelledBy ? undefined : label, "aria-labelledby": labelledBy, children: tags.map((t, i) => {
                    const name = labelOf(t);
                    const extra = typeof t === 'string' ? {} : { color: t.color, mark: t.mark };
                    return _jsx("li", { children: _jsx(Tag, { ...extra, onDismiss: onRemove ? () => remove(name, i) : undefined, children: name }) }, name);
                }) })) : empty ? _jsx("p", { className: "tag-list__empty", children: empty }) : null, _jsx("span", { className: "visually-hidden", role: "status", id: `${id}-s`, children: said })] }));
}
/**
 * TagInput — a labelled field that adds tags, with the tags listed below it,
 * each removable. Generalised from a skills field.
 *
 * - Type and press Enter (or a comma) to add. Blank entries and duplicates
 *   aren't added; "Added Navigation", "Navigation is already added" and
 *   "You can add up to 5" are announced politely.
 * - The list below is named by the label: "Skills, list, 3 items". Removing a
 *   tag moves focus to the next tag's remove button, and back to the field
 *   when none are left.
 * - required, description and error work as on Input.
 */
export function TagInput({ label, tags, onChange, description = 'Press Enter to add each one.', error, required, placeholder, max, empty, className = '', }) {
    const id = useId();
    const field = useRef(null);
    const [text, setText] = useState('');
    const [said, setSaid] = useState('');
    const names = tags.map(labelOf);
    const say = (m) => { setSaid(''); setTimeout(() => setSaid(m), 30); };
    const add = () => {
        const t = text.trim().replace(/,+$/, '').trim();
        if (!t)
            return;
        if (names.some((n) => n.toLowerCase() === t.toLowerCase())) {
            say(`${t} is already added`);
            setText('');
            return;
        }
        if (max !== undefined && names.length >= max) {
            say(`You can add up to ${max}`);
            return;
        }
        onChange([...names, t]);
        setText('');
        say(`Added ${t}`);
    };
    const helpId = error ? `${id}-e` : description ? `${id}-h` : undefined;
    return (_jsxs("div", { className: ['field', 'tag-input', className].filter(Boolean).join(' '), children: [_jsxs("label", { className: "field__label", id: `${id}-l`, htmlFor: `${id}-i`, children: [label, required && _jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" })] }), _jsx("input", { ref: field, id: `${id}-i`, value: text, placeholder: placeholder, "aria-required": required || undefined, "aria-invalid": error ? true : undefined, "aria-describedby": helpId, onChange: (e) => setText(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    add();
                } } }), error
                ? _jsxs("span", { className: "field-error", id: `${id}-e`, children: [_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }), error] })
                : description && _jsx("span", { className: "field-help", id: `${id}-h`, children: description }), _jsx(TagList, { labelledBy: `${id}-l`, tags: tags, empty: empty, emptyFocus: field, onRemove: (t) => onChange(names.filter((n) => n !== t)) }), _jsx("span", { className: "visually-hidden", role: "status", children: said })] }));
}
