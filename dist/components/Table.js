import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
export function SortHeader({ children, sort, onSort, numeric, className = '', ...th }) {
    const next = sort === 'ascending' ? 'descending' : 'ascending';
    return (_jsx("th", { scope: "col", "aria-sort": sort ?? 'none', className: `${numeric ? 'num ' : ''}${className}`.trim() || undefined, ...th, children: _jsxs("button", { type: "button", className: "table__sort", onClick: () => onSort(next), children: [children, _jsx("svg", { className: "table__sort-icon", viewBox: "0 0 12 12", "aria-hidden": "true", children: sort === 'ascending' ? _jsx("path", { d: "M3 7.5 6 4.5l3 3" })
                        : sort === 'descending' ? _jsx("path", { d: "M3 4.5 6 7.5l3-3" })
                            : _jsx("path", { d: "M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" }) })] }) }));
}
export function TableCheck({ checked, indeterminate = false, onChange, label, header, disabled }) {
    const ref = useRef(null);
    useEffect(() => { if (ref.current)
        ref.current.indeterminate = indeterminate; }, [indeterminate]);
    const input = _jsx("input", { ref: ref, type: "checkbox", checked: checked, disabled: disabled, "aria-label": label, onChange: (e) => onChange(e.target.checked) });
    return header ? _jsx("th", { scope: "col", className: "table__check", children: input }) : _jsx("td", { className: "table__check", children: input });
}
export function TableEmpty({ colSpan, title, children, action }) {
    return (_jsx("tr", { children: _jsxs("td", { className: "table__empty", colSpan: colSpan, children: [_jsx("p", { className: "table__empty-title", children: title }), children && _jsx("p", { className: "table__empty-text", children: children }), action && _jsx("div", { className: "table__empty-action", children: action })] }) }));
}
