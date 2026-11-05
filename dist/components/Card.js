import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
export function Card({ title, headingLevel = 3, meta, end, footer, children, variant = 'default', compact, as: Tag = 'div', className = '' }) {
    const H = `h${headingLevel}`;
    const cls = ['card', variant !== 'default' && `card--${variant}`, compact && 'card--compact', className].filter(Boolean).join(' ');
    return (_jsxs(Tag, { className: cls, children: [(title || meta || end) && (_jsxs("div", { className: "card__header", children: [_jsxs("div", { className: "card__heading", children: [title && _jsx(H, { className: "card__title", children: title }), meta && _jsx("p", { className: "card__meta", children: meta })] }), end && _jsx("div", { className: "card__end", children: end })] })), children && _jsx("div", { className: "card__body", children: children }), footer && _jsx("div", { className: "card__footer", children: footer })] }));
}
export function ChoiceCard({ type = 'radio', name, value, checked, onChange, title, description, meta, icon, disabled, compact, className = '' }) {
    const id = useId();
    const cls = ['choice-card', `choice-card--${type}`, compact && 'choice-card--compact', checked && 'is-checked', disabled && 'is-disabled', className].filter(Boolean).join(' ');
    return (_jsxs("label", { className: cls, children: [_jsx("input", { className: "choice-card__input", type: type, name: name, value: value, checked: checked, disabled: disabled, "aria-labelledby": `${id}-t`, "aria-describedby": [description && `${id}-d`, meta && `${id}-m`].filter(Boolean).join(' ') || undefined, onChange: (e) => onChange(e.target.checked, value) }), _jsxs("span", { className: "choice-card__head", id: `${id}-t`, children: [icon && _jsx("span", { className: "choice-card__icon", "aria-hidden": "true", children: icon }), title] }), _jsx("span", { className: "choice-card__mark", "aria-hidden": "true", children: type === 'checkbox' && _jsx("svg", { viewBox: "0 0 12 12", children: _jsx("path", { d: "M2.5 6.2 5 8.5l4.5-5" }) }) }), description && _jsx("span", { className: "choice-card__desc", id: `${id}-d`, children: description }), meta && _jsx("span", { className: "choice-card__meta", id: `${id}-m`, children: meta })] }));
}
