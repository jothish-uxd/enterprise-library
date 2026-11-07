import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
export function Breadcrumbs({ items, maxItems, label = 'Breadcrumb', className = '' }) {
    const [expanded, setExpanded] = useState(false);
    const revealed = useRef(null);
    const fold = !expanded && maxItems !== undefined && maxItems >= 3 && items.length > maxItems;
    // Keep the first item and the last (maxItems - 1); fold what's between.
    const hidden = fold ? items.length - maxItems : 0;
    const tailStart = fold ? items.length - (maxItems - 1) : 1;
    // After opening the fold, put focus on the first level it revealed.
    useEffect(() => {
        if (expanded)
            revealed.current?.querySelector('a, [aria-current]')?.focus();
    }, [expanded]);
    const crumb = (c, i) => {
        const last = i === items.length - 1;
        return (_jsx("li", { className: "breadcrumbs__item", ref: expanded && i === 1 ? revealed : undefined, children: last
                ? _jsx("span", { className: "breadcrumbs__current", "aria-current": "page", tabIndex: -1, children: c.label })
                : c.to ? _jsx(Link, { className: "breadcrumbs__link", to: c.to, children: c.label })
                    : c.href ? _jsx("a", { className: "breadcrumbs__link", href: c.href, children: c.label })
                        : _jsx("span", { className: "breadcrumbs__text", children: c.label }) }, `${c.label}-${i}`));
    };
    return (_jsx("nav", { "aria-label": label, className: ['breadcrumbs', className].filter(Boolean).join(' '), children: _jsx("ol", { className: "breadcrumbs__list", children: fold ? (_jsxs(_Fragment, { children: [crumb(items[0], 0), _jsx("li", { className: "breadcrumbs__item", children: _jsx("button", { type: "button", className: "breadcrumbs__more", "aria-label": `Show ${hidden} more ${hidden === 1 ? 'level' : 'levels'}`, onClick: () => setExpanded(true), children: "\u2026" }) }), items.slice(tailStart).map((c, j) => crumb(c, tailStart + j))] })) : items.map(crumb) }) }));
}
