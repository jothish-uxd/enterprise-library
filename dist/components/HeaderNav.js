import { jsx as _jsx } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
export function HeaderNav({ items, label = 'Primary', className = '' }) {
    return (_jsx("nav", { className: ['headernav', className].filter(Boolean).join(' '), "aria-label": label, children: _jsx("ul", { className: "headernav__list", children: items.map((it) => (_jsx("li", { className: "headernav__item", children: it.to
                    ? _jsx(NavLink, { to: it.to, end: it.end, className: "headernav__link", children: it.label })
                    : _jsx("a", { href: it.href, className: "headernav__link", "aria-current": it.current ? 'page' : undefined, children: it.label }) }, it.to ?? it.href ?? it.label))) }) }));
}
