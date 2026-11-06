import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
import { useTooltip } from './Tooltip';
export function Radio({ label, name, value, checked, onChange, description, disabled, disabledReason, id, className = '' }) {
    const auto = useId();
    const inputId = id ?? `rb-${auto}`;
    const tip = useTooltip(disabled ? disabledReason : null);
    const describedBy = [description ? `${inputId}-d` : null, tip.describedBy].filter(Boolean).join(' ') || undefined;
    const cls = ['check', description && 'check--desc', disabled && 'is-disabled', className].filter(Boolean).join(' ');
    return (_jsxs(_Fragment, { children: [_jsxs("label", { className: cls, htmlFor: inputId, ...tip.hoverProps, children: [_jsx("input", { ref: (el) => { tip.anchorRef.current = el; }, id: inputId, type: "radio", name: name, value: value, checked: checked, "aria-labelledby": `${inputId}-l`, "aria-describedby": describedBy, "aria-disabled": disabled || undefined, onChange: () => { if (!disabled)
                            onChange(value); }, onClick: (e) => { if (disabled)
                            e.preventDefault(); }, ...tip.focusProps }), _jsxs("span", { className: "check__text", children: [_jsx("span", { className: "check__label", id: `${inputId}-l`, children: label }), description && _jsx("span", { className: "check__desc", id: `${inputId}-d`, children: description })] })] }), tip.tooltip] }));
}
