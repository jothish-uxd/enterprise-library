import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
export function Skeleton({ label, lines = 3, heading, avatar, rows = 1, className = '' }) {
    const id = useId();
    return (_jsxs("div", { className: ['skeleton', className].filter(Boolean).join(' '), role: "progressbar", "aria-labelledby": id, children: [_jsx("span", { id: id, className: "visually-hidden", children: label }), Array.from({ length: Math.max(1, rows) }, (_, r) => (_jsxs("div", { className: ['skeleton__row', avatar && 'skeleton__row--avatar'].filter(Boolean).join(' '), "aria-hidden": "true", children: [avatar && _jsx("span", { className: "skeleton__avatar" }), _jsxs("span", { className: "skeleton__lines", children: [heading && _jsx("span", { className: "skeleton__bone skeleton__bone--heading" }), Array.from({ length: Math.max(0, lines) }, (_, i) => _jsx("span", { className: "skeleton__bone" }, i))] })] }, r)))] }));
}
