import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertIcon, CLOSE_ICON, TONE_WORD } from './AlertIcon';
export function Banner({ tone = 'info', variant = 'inline', title, children, action, onDismiss, announce, className = '', }) {
    const live = announce ?? (tone === 'error' ? 'assertive' : 'polite');
    const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
    const cls = ['banner', `banner--${variant}`, `banner--${tone}`, className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, role: role, children: [_jsx(AlertIcon, { tone: tone }), _jsxs("div", { className: "banner__text", children: [_jsxs("span", { className: "visually-hidden", children: [TONE_WORD[tone], ": "] }), title && _jsx("strong", { className: "banner__title", children: title }), title && children ? ' ' : null, children && _jsx("span", { className: "banner__message", children: children })] }), action && _jsx("div", { className: "banner__action", children: action }), onDismiss && (_jsx("button", { type: "button", className: "banner__close", "aria-label": "Dismiss", onClick: onDismiss, children: CLOSE_ICON }))] }));
}
