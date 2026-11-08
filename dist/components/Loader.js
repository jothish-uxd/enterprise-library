import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
const R = 15.9155; // circumference 100
const TICKS = 12;
const MEASURABLE = ['circle', 'ticks', 'line'];
export function Loader({ type = 'circle', label, value, max = 100, valueText, size = 'md', labelPosition = 'end', lines = 3, className = '', }) {
    const id = useId();
    const known = MEASURABLE.includes(type) && typeof value === 'number' && Number.isFinite(value);
    const clamped = known ? Math.min(Math.max(value, 0), max) : 0;
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const text = known ? (valueText ?? `${Math.round(pct)}%`) : undefined;
    const position = type === 'skeleton' ? 'hidden' : labelPosition;
    const inside = known && size === 'lg' && (type === 'circle' || type === 'ticks');
    const cls = ['loader', `loader--${type}`, `loader--${size}`, `loader--label-${position}`, !known && 'loader--waiting', className]
        .filter(Boolean).join(' ');
    let mark;
    if (type === 'circle') {
        mark = (_jsxs("svg", { viewBox: "0 0 36 36", "aria-hidden": "true", focusable: "false", children: [_jsx("circle", { className: "loader__track", cx: "18", cy: "18", r: R }), _jsx("circle", { className: "loader__fill", cx: "18", cy: "18", r: R, pathLength: 100, strokeDasharray: known ? `${pct} 100` : '25 100' })] }));
    }
    else if (type === 'ticks') {
        const lit = Math.round((pct / 100) * TICKS);
        mark = (_jsx("svg", { viewBox: "0 0 36 36", "aria-hidden": "true", focusable: "false", children: Array.from({ length: TICKS }, (_, i) => (_jsx("line", { x1: "18", y1: "2.5", x2: "18", y2: "8.5", transform: `rotate(${i * 30} 18 18)`, className: known ? (i < lit ? 'loader__tick is-on' : 'loader__tick') : `loader__tick loader__tick--${i}` }, i))) }));
    }
    else if (type === 'line') {
        mark = _jsx("span", { className: "loader__fill", style: known ? { width: `${pct}%` } : undefined });
    }
    else if (type === 'dots') {
        mark = _jsxs(_Fragment, { children: [_jsx("span", { className: "loader__dot" }), _jsx("span", { className: "loader__dot" }), _jsx("span", { className: "loader__dot" })] });
    }
    else {
        mark = Array.from({ length: Math.max(1, lines) }, (_, i) => _jsx("span", { className: "loader__bone" }, i));
    }
    return (_jsxs("div", { className: cls, children: [_jsxs("div", { className: "loader__mark", role: "progressbar", "aria-labelledby": `${id}-l`, "aria-valuemin": known ? 0 : undefined, "aria-valuemax": known ? max : undefined, "aria-valuenow": known ? clamped : undefined, "aria-valuetext": text, children: [mark, inside && _jsx("span", { className: "loader__value", "aria-hidden": "true", children: text })] }), _jsxs("span", { id: `${id}-l`, className: position === 'hidden' ? 'visually-hidden' : 'loader__label', children: [label, known && !inside && position !== 'hidden' && _jsx("span", { className: "loader__inline-value", "aria-hidden": "true", children: text })] })] }));
}
