import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
const R = 15.9155; // circumference 100
export function ProgressIndicator({ label, value, max = 100, valueText, size = 'md', labelPosition = 'end', className = '', }) {
    const id = useId();
    const known = typeof value === 'number' && Number.isFinite(value);
    const clamped = known ? Math.min(Math.max(value, 0), max) : 0;
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const text = known ? (valueText ?? `${Math.round(pct)}%`) : undefined;
    const cls = ['progress-indicator', `progress-indicator--${size}`, `progress-indicator--label-${labelPosition}`,
        !known && 'progress-indicator--spin', className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, children: [_jsxs("div", { className: "progress-indicator__ring", role: "progressbar", "aria-labelledby": `${id}-l`, "aria-valuemin": known ? 0 : undefined, "aria-valuemax": known ? max : undefined, "aria-valuenow": known ? clamped : undefined, "aria-valuetext": text, children: [_jsxs("svg", { viewBox: "0 0 36 36", "aria-hidden": "true", focusable: "false", children: [_jsx("circle", { className: "progress-indicator__track", cx: "18", cy: "18", r: R }), _jsx("circle", { className: "progress-indicator__fill", cx: "18", cy: "18", r: R, pathLength: 100, strokeDasharray: known ? `${pct} 100` : '25 100' })] }), known && size === 'lg' && _jsx("span", { className: "progress-indicator__value", "aria-hidden": "true", children: text })] }), _jsxs("span", { id: `${id}-l`, className: labelPosition === 'hidden' ? 'visually-hidden' : 'progress-indicator__label', children: [label, known && size !== 'lg' && labelPosition !== 'hidden' && _jsx("span", { className: "progress-indicator__inline-value", "aria-hidden": "true", children: text })] })] }));
}
