import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTooltip } from './Tooltip';
export function Button({ variant = 'primary', size = 'md', icon, iconPosition = 'start', iconOnly, pressed, disabled, disabledReason, children, className = '', type = 'button', onClick, ...rest }) {
    const reason = disabled && disabledReason ? disabledReason : null;
    // One tooltip: the reason when unavailable, otherwise the label for icon-only buttons.
    const tip = useTooltip(reason ?? (iconOnly ? children : null));
    const describedBy = [rest['aria-describedby'], reason ? tip.describedBy : null].filter(Boolean).join(' ') || undefined;
    const cls = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, iconOnly && 'btn--icon', className].filter(Boolean).join(' ');
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ...rest, ref: (el) => { tip.anchorRef.current = el; }, type: type, className: cls, "aria-pressed": pressed, "aria-disabled": disabled || undefined, "aria-describedby": describedBy, onClick: (e) => { if (disabled) {
                    e.preventDefault();
                    return;
                } onClick?.(e); }, ...tip.hoverProps, ...tip.focusProps, children: [icon && (iconOnly || iconPosition === 'start') && _jsx("span", { className: "btn__icon", "aria-hidden": "true", children: icon }), iconOnly ? _jsx("span", { className: "visually-hidden", children: children }) : children, icon && !iconOnly && iconPosition === 'end' && _jsx("span", { className: "btn__icon btn__icon--end", "aria-hidden": "true", children: icon })] }), tip.tooltip] }));
}
