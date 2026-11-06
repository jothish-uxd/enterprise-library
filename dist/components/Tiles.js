import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Tiles({ layout = 'joined', columns, minWidth, label, id, className = '', children }) {
    const style = {};
    if (columns)
        style['--tiles-columns'] = String(columns);
    if (minWidth)
        style['--tiles-min'] = `${minWidth}px`;
    const separate = layout === 'separate' || layout === 'cards';
    const cls = ['tiles', separate && 'tiles--separate', className].filter(Boolean).join(' ');
    return _jsx("ul", { className: cls, id: id, "aria-label": label, style: style, children: children });
}
export function Tile({ title, description, tag, tagStrong, media, href, as: Link = 'a', hidden, linkProps, className = '' }) {
    return (_jsx("li", { className: `tile ${className}`.trim(), hidden: hidden, children: _jsxs(Link, { className: "tile__link", href: href, ...linkProps, children: [media && _jsx("span", { className: "tile__media", "aria-hidden": "true", children: media }), _jsxs("span", { className: "tile__head", children: [_jsx("span", { className: "tile__title", children: title }), tag && _jsx("span", { className: `tile__tag${tagStrong ? ' tile__tag--strong' : ''}`, children: tag })] }), description && _jsx("span", { className: "tile__desc", children: description })] }) }));
}
