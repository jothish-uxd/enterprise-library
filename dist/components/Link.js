import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link as RouterLink } from 'react-router-dom';
const NEW_TAB_ICON = (_jsx("svg", { className: "link__icon", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M9.5 2.5h4v4M13.5 2.5 8 8M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" }) }));
export function Link({ children, to, href, newTab, className = '', rel, ...rest }) {
    const cls = ['link', newTab && 'link--new-tab', className].filter(Boolean).join(' ');
    const content = newTab ? (_jsxs(_Fragment, { children: [children, _jsxs("span", { className: "link__new-tab", children: ['⁠', NEW_TAB_ICON, _jsx("span", { className: "visually-hidden", children: " (opens in a new tab)" })] })] })) : children;
    if (to && !newTab)
        return _jsx(RouterLink, { className: cls, to: to, ...rest, children: content });
    return (_jsx("a", { className: cls, href: href ?? to, target: newTab ? '_blank' : undefined, rel: newTab ? ['noopener', 'noreferrer', rel].filter(Boolean).join(' ') : rel, ...rest, children: content }));
}
