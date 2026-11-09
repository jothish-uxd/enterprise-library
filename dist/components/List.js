import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function List({ children, marker = 'bullet', divided, compact, inline, label, className = '' }) {
    const ordered = marker === 'number' || marker === 'steps';
    const custom = marker === 'check' || marker === 'none' || marker === 'steps' || inline;
    const cls = ['list', marker === 'check' && 'list--check', marker === 'none' && 'list--plain', marker === 'steps' && 'list--steps',
        divided && 'list--divided', compact && 'list--compact', inline && 'list--inline', className].filter(Boolean).join(' ');
    const props = { className: cls, role: custom ? 'list' : undefined, 'aria-label': label };
    return ordered ? _jsx("ol", { ...props, children: children }) : _jsx("ul", { ...props, children: children });
}
export function DescriptionList({ items, layout = 'stacked', className = '' }) {
    const cls = ['dl', layout !== 'stacked' && `dl--${layout}`, className].filter(Boolean).join(' ');
    return (_jsx("dl", { className: cls, children: items.map((it, i) => (_jsxs("div", { children: [_jsx("dt", { children: it.term }), (Array.isArray(it.details) ? it.details : [it.details]).map((d, j) => _jsx("dd", { children: d }, j))] }, i))) }));
}
