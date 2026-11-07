import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const CHECK = _jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "m4 8.5 2.6 2.5L12 5.5" }) });
const DEFAULT_TEXT = { complete: 'complete', 'in-progress': 'in progress', 'not-started': 'not started' };
export function Stepper({ label, steps, current, variant = 'full', orientation = 'horizontal', unit = 'Step', statusText, className = '', }) {
    const text = { ...DEFAULT_TEXT, ...statusText };
    const at = Math.max(0, steps.findIndex((s) => s.id === current));
    if (variant === 'compact') {
        const s = steps[at];
        return (_jsxs("p", { className: ['stepper', 'stepper--compact', className].filter(Boolean).join(' '), children: [_jsx("span", { className: "stepper__bar", "aria-hidden": "true", children: steps.map((x, n) => (_jsx("span", { className: x.status === 'complete' ? 'is-complete' : n === at ? 'is-current' : '' }, x.id))) }), _jsxs("span", { className: "stepper__text", children: [_jsxs("span", { className: "stepper__count", children: [unit, " ", at + 1, " of ", steps.length, _jsx("span", { className: "visually-hidden", children: ":" })] }), ' ', s?.label, _jsxs("span", { className: "visually-hidden", children: [", ", s ? text[s.status] : ''] })] })] }));
    }
    const links = steps.some((s) => s.to || s.href);
    const list = (_jsx("ol", { className: "stepper__list", "aria-label": links ? undefined : label, children: steps.map((s, i) => {
            const isCurrent = i === at;
            const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: "stepper__num", "aria-hidden": "true", children: s.status === 'complete' ? CHECK : i + 1 }), _jsxs("span", { className: "stepper__label", children: [_jsxs("span", { className: "visually-hidden", children: [i + 1, ". "] }), s.label, _jsxs("span", { className: "visually-hidden", children: [", ", text[s.status]] })] })] }));
            const cls = ['stepper__step', `is-${s.status}`, isCurrent && 'is-current'].filter(Boolean).join(' ');
            const currentAttr = isCurrent ? (links ? 'page' : 'step') : undefined;
            return (_jsx("li", { className: "stepper__item", children: s.to ? _jsx(Link, { className: cls, to: s.to, "aria-current": currentAttr, children: inner })
                    : s.href ? _jsx("a", { className: cls, href: s.href, "aria-current": currentAttr, children: inner })
                        : _jsx("span", { className: cls, "aria-current": currentAttr, children: inner }) }, s.id));
        }) }));
    const cls = ['stepper', orientation === 'vertical' && 'stepper--vertical', className].filter(Boolean).join(' ');
    return links ? _jsx("nav", { className: cls, "aria-label": label, children: list }) : _jsx("div", { className: cls, children: list });
}
