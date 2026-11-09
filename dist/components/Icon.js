import { jsx as _jsx } from "react/jsx-runtime";
import { ICONS } from '../icons/data';
const PX = { sm: 16, md: 20, lg: 24 };
export function Icon({ name, size = 'md', label, className = '', ...rest }) {
    const px = typeof size === 'number' ? size : PX[size];
    return (_jsx("svg", { className: ['icon', typeof size === 'string' && `icon--${size}`, className].filter(Boolean).join(' '), viewBox: "0 0 24 24", width: px, height: px, fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", focusable: "false", ...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }), ...rest, dangerouslySetInnerHTML: { __html: ICONS[name] } }));
}
export { ICONS, ICON_GROUPS } from '../icons/data';
