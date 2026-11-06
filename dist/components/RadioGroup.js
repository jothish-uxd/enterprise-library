import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { Radio } from './Radio';
const ErrorIcon = () => (_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }));
export function RadioGroup({ legend, options, value, onChange, orientation = 'vertical', required, description, error, name, className = '', }) {
    const id = useId();
    const groupName = name ?? `rg-${id}`;
    const note = error ? `${id}-e` : description ? `${id}-h` : undefined;
    const horizontal = orientation === 'horizontal';
    return (_jsxs("fieldset", { role: "radiogroup", className: ['checks', 'checks--stack', 'radio-group', error && 'is-invalid', className].filter(Boolean).join(' '), "aria-labelledby": `${id}-l`, "aria-describedby": note, "aria-required": required || undefined, "aria-invalid": error ? true : undefined, children: [_jsxs("legend", { className: "field__label", id: `${id}-l`, children: [legend, required && _jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" })] }), _jsx("div", { className: horizontal ? 'checks' : 'checks checks--stack', children: options.map((o) => (_jsx(Radio, { name: groupName, value: o.value, label: o.label, description: o.description, checked: value === o.value, onChange: onChange, disabled: o.disabled, disabledReason: o.disabledReason }, o.value))) }), error ? _jsxs("span", { className: "field-error", id: `${id}-e`, children: [_jsx(ErrorIcon, {}), error] })
                : description ? _jsx("span", { className: "field-help", id: `${id}-h`, children: description }) : null] }));
}
