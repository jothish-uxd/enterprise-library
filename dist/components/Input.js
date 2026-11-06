import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { useTooltip } from './Tooltip';
const ErrorIcon = () => (_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }));
export function Input({ label, description, error, required, icon, disabled, disabledReason, width = 'full', id, className = '', readOnly, 'aria-describedby': extraDescribedBy, ...rest }) {
    const auto = useId();
    const inputId = id ?? `in-${auto}`;
    const tip = useTooltip(disabled ? disabledReason : null);
    const describedBy = [
        error ? `${inputId}-e` : description ? `${inputId}-h` : null, tip.describedBy, extraDescribedBy,
    ].filter(Boolean).join(' ') || undefined;
    const input = (_jsx("input", { ref: (el) => { tip.anchorRef.current = el; }, id: inputId, ...rest, readOnly: readOnly || disabled, "aria-disabled": disabled || undefined, "aria-required": required || undefined, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, ...tip.focusProps }));
    const cls = ['field', width === 'narrow' && 'field--narrow', disabled && 'is-disabled', className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, ...tip.hoverProps, children: [_jsxs("label", { className: "field__label", htmlFor: inputId, children: [label, required && _jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" })] }), icon ? _jsxs("div", { className: "field__control", children: [_jsx("span", { className: "field__icon", "aria-hidden": "true", children: icon }), input] }) : input, error
                ? _jsxs("span", { className: "field-error", id: `${inputId}-e`, children: [_jsx(ErrorIcon, {}), error] })
                : description && _jsx("span", { className: "field-help", id: `${inputId}-h`, children: description }), tip.tooltip] }));
}
