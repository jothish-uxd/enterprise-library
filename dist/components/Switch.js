import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
import { useTooltip } from './Tooltip';
export function Switch({ label, checked, onChange, description, showState, disabled, disabledReason, size = 'md', labelPosition = 'end', name, id, className = '', }) {
    const auto = useId();
    const inputId = id ?? `sw-${auto}`;
    const tip = useTooltip(disabled ? disabledReason : null);
    const describedBy = [description ? `${inputId}-d` : null, tip.describedBy].filter(Boolean).join(' ') || undefined;
    const cls = ['switch', size === 'sm' && 'switch--sm', labelPosition !== 'end' && `switch--${labelPosition}`, disabled && 'is-disabled', className].filter(Boolean).join(' ');
    return (_jsxs(_Fragment, { children: [_jsxs("label", { className: cls, htmlFor: inputId, ...tip.hoverProps, children: [_jsxs("span", { className: "switch__track", ref: (el) => { tip.anchorRef.current = el; }, children: [_jsx("input", { id: inputId, className: "switch__input", type: "checkbox", role: "switch", name: name, checked: checked, "aria-labelledby": `${inputId}-l`, "aria-disabled": disabled || undefined, "aria-describedby": describedBy, onChange: (e) => { if (!disabled)
                                    onChange(e.target.checked); }, onClick: (e) => { if (disabled)
                                    e.preventDefault(); }, ...tip.focusProps }), _jsx("span", { className: "switch__thumb", "aria-hidden": "true" })] }), _jsxs("span", { className: "switch__text", children: [_jsxs("span", { className: "switch__label", id: `${inputId}-l`, children: [label, showState && _jsx("span", { className: "switch__state", "aria-hidden": "true", children: checked ? 'On' : 'Off' })] }), description && _jsx("span", { className: "switch__desc", id: `${inputId}-d`, children: description })] })] }), tip.tooltip] }));
}
