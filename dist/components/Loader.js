import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
const R = 15.9155; // circumference 100
const TICKS = 12;
const MEASURABLE = ['circle', 'ticks'];
const SVG = { viewBox: '0 0 36 36', 'aria-hidden': true, focusable: false };
function Mark({ type, known, pct }) {
    switch (type) {
        case 'ticks': {
            const lit = Math.round((pct / 100) * TICKS);
            return (_jsx("svg", { ...SVG, children: Array.from({ length: TICKS }, (_, i) => (_jsx("line", { x1: "18", y1: "2.5", x2: "18", y2: "8.5", transform: `rotate(${i * 30} 18 18)`, className: known ? (i < lit ? 'loader__tick is-on' : 'loader__tick') : `loader__tick loader__tick--${i}` }, i))) }));
        }
        case 'dots':
            return _jsx("span", { className: "loader__row", children: [0, 1, 2].map((i) => _jsx("span", { className: "loader__dot" }, i)) });
        case 'bars':
            return _jsx("span", { className: "loader__row", children: [0, 1, 2, 3].map((i) => _jsx("span", { className: "loader__bar" }, i)) });
        case 'orbit':
            return (_jsxs("svg", { ...SVG, children: [_jsx("circle", { className: "loader__track", cx: "18", cy: "18", r: "13" }), _jsx("g", { className: "loader__orbit", children: _jsx("circle", { className: "loader__moon", cx: "18", cy: "5", r: "3.5" }) })] }));
        case 'pulse':
            return (_jsxs("svg", { ...SVG, children: [_jsx("circle", { className: "loader__wave", cx: "18", cy: "18", r: "6" }), _jsx("circle", { className: "loader__core", cx: "18", cy: "18", r: "6" })] }));
        case 'grid':
            return _jsx("span", { className: "loader__grid", children: Array.from({ length: 9 }, (_, i) => _jsx("span", { className: `loader__cell loader__cell--${(i % 3) + Math.floor(i / 3)}` }, i)) });
        default:
            return (_jsxs("svg", { ...SVG, children: [_jsx("circle", { className: "loader__track", cx: "18", cy: "18", r: R }), _jsx("circle", { className: "loader__fill", cx: "18", cy: "18", r: R, pathLength: 100, strokeDasharray: known ? `${pct} 100` : '25 100' })] }));
    }
}
export function Loader({ type = 'circle', label, value, max = 100, valueText, size = 'md', labelPosition = 'end', className = '', }) {
    const id = useId();
    const known = MEASURABLE.includes(type) && typeof value === 'number' && Number.isFinite(value);
    const clamped = known ? Math.min(Math.max(value, 0), max) : 0;
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const text = known ? (valueText ?? `${Math.round(pct)}%`) : undefined;
    const inside = known && size === 'lg';
    const cls = ['loader', `loader--${type}`, `loader--${size}`, `loader--label-${labelPosition}`, !known && 'loader--waiting', className]
        .filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, children: [_jsxs("div", { className: "loader__mark", role: "progressbar", "aria-labelledby": `${id}-l`, "aria-valuemin": known ? 0 : undefined, "aria-valuemax": known ? max : undefined, "aria-valuenow": known ? clamped : undefined, "aria-valuetext": text, children: [_jsx(Mark, { type: type, known: known, pct: pct }), inside && _jsx("span", { className: "loader__value", "aria-hidden": "true", children: text })] }), _jsxs("span", { id: `${id}-l`, className: labelPosition === 'hidden' ? 'visually-hidden' : 'loader__label', children: [label, known && !inside && labelPosition !== 'hidden' && _jsx("span", { className: "loader__inline-value", "aria-hidden": "true", children: text })] })] }));
}
