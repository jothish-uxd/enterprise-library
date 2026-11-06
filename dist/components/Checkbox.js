import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { useTooltip } from './Tooltip';
const ErrorIcon = () => (_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }));
export function Checkbox({ label, checked, onChange, description, indeterminate = false, required, error, disabled, disabledReason, name, value, id, className = '', }) {
    const auto = useId();
    const inputId = id ?? `cb-${auto}`;
    const ref = useRef(null);
    useEffect(() => { if (ref.current)
        ref.current.indeterminate = indeterminate; }, [indeterminate]);
    const tip = useTooltip(disabled ? disabledReason : null);
    const describedBy = [description ? `${inputId}-d` : null, error ? `${inputId}-e` : null, tip.describedBy].filter(Boolean).join(' ') || undefined;
    const cls = ['check', description && 'check--desc', disabled && 'is-disabled', error && 'is-invalid'].filter(Boolean).join(' ');
    return (_jsxs("div", { className: `check-field ${className}`.trim(), children: [_jsxs("label", { className: cls, htmlFor: inputId, ...tip.hoverProps, children: [_jsx("input", { ref: (el) => { ref.current = el; tip.anchorRef.current = el; }, id: inputId, type: "checkbox", name: name, value: value, checked: checked, "aria-labelledby": `${inputId}-l`, "aria-describedby": describedBy, "aria-required": required || undefined, "aria-invalid": error ? true : undefined, "aria-disabled": disabled || undefined, onChange: (e) => { if (!disabled)
                            onChange(e.target.checked); }, onClick: (e) => { if (disabled)
                            e.preventDefault(); }, ...tip.focusProps }), _jsxs("span", { className: "check__text", children: [_jsxs("span", { className: "check__label", id: `${inputId}-l`, children: [label, required && _jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" })] }), description && _jsx("span", { className: "check__desc", id: `${inputId}-d`, children: description })] })] }), error && _jsxs("span", { className: "field-error check__error", id: `${inputId}-e`, children: [_jsx(ErrorIcon, {}), error] }), tip.tooltip] }));
}
