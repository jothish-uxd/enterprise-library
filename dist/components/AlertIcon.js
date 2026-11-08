import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/** What screen readers hear before the message, since the icon is hidden */
export const TONE_WORD = { error: 'Error', warning: 'Warning', success: 'Done', info: 'Note' };
/** One shape per tone, so tone never rests on colour: a filled circle with !,
 *  a filled triangle with !, a filled circle with a check, a ring with i. */
const SHAPES = {
    error: _jsxs(_Fragment, { children: [_jsx("circle", { cx: "7", cy: "7", r: "6", className: "alert-icon__fill" }), _jsx("path", { d: "M7 3.8v3.6", className: "alert-icon__cut" }), _jsx("circle", { cx: "7", cy: "10", r: ".9", className: "alert-icon__dot" })] }),
    warning: _jsxs(_Fragment, { children: [_jsx("path", { d: "M7 1.4l6 10.8H1z", className: "alert-icon__fill alert-icon__tri" }), _jsx("path", { d: "M7 5.2v3.2", className: "alert-icon__cut" }), _jsx("circle", { cx: "7", cy: "10.2", r: ".85", className: "alert-icon__dot" })] }),
    success: _jsxs(_Fragment, { children: [_jsx("circle", { cx: "7", cy: "7", r: "6", className: "alert-icon__fill" }), _jsx("path", { d: "M4.3 7.2l1.8 1.8 3.6-3.8", className: "alert-icon__cut" })] }),
    info: _jsxs(_Fragment, { children: [_jsx("circle", { cx: "7", cy: "7", r: "5.6", className: "alert-icon__ring" }), _jsx("path", { d: "M7 6.3v4", className: "alert-icon__line" }), _jsx("circle", { cx: "7", cy: "4.1", r: ".85", className: "alert-icon__ink" })] }),
};
export function AlertIcon({ tone }) {
    return _jsx("svg", { className: "alert-icon", viewBox: "0 0 14 14", "aria-hidden": "true", focusable: "false", children: SHAPES[tone] });
}
export const CLOSE_ICON = _jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M4 4l8 8M12 4l-8 8" }) });
