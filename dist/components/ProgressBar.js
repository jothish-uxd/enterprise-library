import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { AlertIcon } from './AlertIcon';
export function ProgressBar({ label, value, max = 100, valueText, showValue = true, hideLabel, description, error, size = 'md', className = '', }) {
    const id = useId();
    const known = typeof value === 'number' && Number.isFinite(value);
    const clamped = known ? Math.min(Math.max(value, 0), max) : 0;
    const pct = max > 0 ? Math.round((clamped / max) * 100) : 0;
    const text = known ? (valueText ?? `${pct}%`) : undefined;
    const note = error ?? description;
    const cls = ['progress', size === 'sm' && 'progress--sm', !known && 'progress--indeterminate', error && 'is-error', className]
        .filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, children: [_jsxs("div", { className: hideLabel ? 'visually-hidden' : 'progress__head', children: [_jsx("span", { className: "progress__label", id: `${id}-l`, children: label }), showValue && text && !hideLabel && _jsx("span", { className: "progress__value", "aria-hidden": "true", children: text })] }), _jsx("div", { className: "progress__track", role: "progressbar", "aria-labelledby": `${id}-l`, "aria-describedby": note ? `${id}-d` : undefined, "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": known ? clamped : undefined, "aria-valuetext": known ? text : undefined, children: _jsx("span", { className: "progress__fill", style: known ? { width: `${(clamped / max) * 100}%` } : undefined }) }), note && (_jsxs("p", { className: "progress__note", id: `${id}-d`, children: [error && _jsx(AlertIcon, { tone: "error" }), _jsxs("span", { children: [error && _jsx("span", { className: "visually-hidden", children: "Error: " }), note] })] }))] }));
}
