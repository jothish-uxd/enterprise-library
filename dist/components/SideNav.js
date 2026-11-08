import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
const BACK = _jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M10 3 5 8l5 5" }) });
const PLUS = _jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: "M8 3v10M3 8h10" }) });
function Item({ item }) {
    const cls = ['sidenav__link', item.strong && 'sidenav__link--strong'].filter(Boolean).join(' ');
    const body = (_jsxs(_Fragment, { children: [_jsx("span", { className: "sidenav__label", children: item.label }), item.count !== undefined && _jsx("span", { className: "sidenav__count", children: item.count.toLocaleString('en-US') })] }));
    if (item.to)
        return _jsx(NavLink, { to: item.to, end: item.end, className: cls, children: body });
    return _jsx("a", { href: item.href, className: cls, "aria-current": item.current ? 'page' : undefined, children: body });
}
function Plain({ to, href, className, children }) {
    return to ? _jsx(RouterLink, { to: to, className: className, children: children }) : _jsx("a", { href: href, className: className, children: children });
}
export function SideNav({ label, groups, back, headingLevel = 2, top, footer, className = '', id }) {
    const uid = useId();
    const Heading = `h${headingLevel}`;
    return (_jsxs("nav", { id: id, className: ['sidenav', className].filter(Boolean).join(' '), "aria-label": label, children: [back && _jsxs(Plain, { to: back.to, href: back.href, className: "sidenav__back", children: [BACK, back.label] }), top && _jsx("div", { className: "sidenav__top", children: top }), groups.map((g, i) => {
                const hid = g.title ? `${uid}-g${i}` : undefined;
                const cls = ['sidenav__group', g.hideTitle && 'sidenav__group--ruled', g.icon && 'sidenav__group--icon'].filter(Boolean).join(' ');
                return (_jsxs("div", { className: cls, children: [g.title && (_jsxs(Heading, { id: hid, className: g.hideTitle ? 'visually-hidden' : 'sidenav__heading', children: [g.icon && !g.hideTitle && _jsx("span", { className: "sidenav__icon", "aria-hidden": "true", children: g.icon }), g.title] })), g.items.length > 0 && (_jsx("ul", { className: "sidenav__list", "aria-labelledby": hid, children: g.items.map((it) => _jsx("li", { children: _jsx(Item, { item: it }) }, it.to ?? it.href ?? it.label)) })), g.items.length === 0 && g.empty && _jsx("p", { className: "sidenav__empty", children: g.empty }), g.action && _jsxs(Plain, { to: g.action.to, href: g.action.href, className: "sidenav__action", children: [PLUS, g.action.label] })] }, i));
            }), footer && _jsx("div", { className: "sidenav__footer", children: footer })] }));
}
