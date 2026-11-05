import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function StatFilter({ label, items, value, onChange, controls, className = '' }) {
    return (_jsx("ul", { className: `stat-filter ${className}`, role: "group", "aria-label": label, children: items.map((it) => (_jsx("li", { children: _jsxs("button", { type: "button", className: "stat-filter__btn", "aria-pressed": value === it.value, "aria-controls": controls, onClick: () => onChange(it.value), children: [_jsx("span", { className: "stat-filter__n", children: it.count.toLocaleString('en-US') }), _jsx("span", { className: "stat-filter__label", children: it.label })] }) }, it.value))) }));
}
