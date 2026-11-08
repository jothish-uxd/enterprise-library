import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const SHAPES = {
    dashed: _jsx("circle", { cx: "7", cy: "7", r: "5.25", className: "status-mark__line", strokeDasharray: "2.4 1.8" }),
    ring: _jsx("circle", { cx: "7", cy: "7", r: "5.25", className: "status-mark__line" }),
    half: _jsxs(_Fragment, { children: [_jsx("circle", { cx: "7", cy: "7", r: "5.25", className: "status-mark__line" }), _jsx("path", { d: "M7 1.75a5.25 5.25 0 0 1 0 10.5z", className: "status-mark__fill" })] }),
    filled: _jsx("circle", { cx: "7", cy: "7", r: "6", className: "status-mark__fill" }),
    check: _jsxs(_Fragment, { children: [_jsx("circle", { cx: "7", cy: "7", r: "6", className: "status-mark__fill" }), _jsx("path", { d: "M4.3 7.2l1.8 1.8 3.6-3.8", className: "status-mark__tick" })] }),
    slash: _jsxs(_Fragment, { children: [_jsx("circle", { cx: "7", cy: "7", r: "5.25", className: "status-mark__line" }), _jsx("path", { d: "M3.3 10.7l7.4-7.4", className: "status-mark__line" })] }),
};
/** Just the mark, for use inside another component such as a Tag */
export function StatusMarkIcon({ mark, className = 'status-mark__icon' }) {
    return _jsx("svg", { className: className, viewBox: "0 0 14 14", "aria-hidden": "true", focusable: "false", children: SHAPES[mark] });
}
export function StatusMark({ mark, children, variant = 'plain', size = 'md', muted, className = '' }) {
    const cls = ['status-mark', `status-mark--${mark}`, variant === 'badge' && 'status-mark--badge', size === 'sm' && 'status-mark--sm', muted && 'is-muted', className]
        .filter(Boolean).join(' ');
    return (_jsxs("span", { className: cls, children: [_jsx("svg", { className: "status-mark__icon", viewBox: "0 0 14 14", "aria-hidden": "true", focusable: "false", children: SHAPES[mark] }), _jsx("span", { className: "status-mark__text", children: children })] }));
}
