import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
import { Checkbox } from './Checkbox';
const ErrorIcon = () => (_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }));
export function CheckboxGroup({ legend, options, value, onChange, orientation = 'vertical', selectAll, description, required, error, name, className = '', }) {
    const id = useId();
    const usable = options.filter((o) => !o.disabled);
    const chosen = usable.filter((o) => value.includes(o.value)).length;
    const all = usable.length > 0 && chosen === usable.length;
    const toggle = (v, on) => onChange(on ? options.map((o) => o.value).filter((x) => x === v || value.includes(x)) : value.filter((x) => x !== v));
    const setAll = (on) => onChange(on ? Array.from(new Set([...value, ...usable.map((o) => o.value)])) : value.filter((x) => !usable.some((o) => o.value === x)));
    const horizontal = orientation === 'horizontal';
    const list = (_jsx("div", { className: ['checks', !horizontal && 'checks--stack', selectAll && 'checks--nested'].filter(Boolean).join(' '), children: options.map((o) => (_jsx(Checkbox, { name: name, value: o.value, label: o.label, description: o.description, checked: value.includes(o.value), onChange: (on) => toggle(o.value, on), disabled: o.disabled, disabledReason: o.disabledReason }, o.value))) }));
    const note = error ? `${id}-e` : description ? `${id}-h` : undefined;
    return (_jsxs("fieldset", { className: ['checks', 'checks--stack', 'checkbox-group', error && 'is-invalid', className].filter(Boolean).join(' '), "aria-describedby": note, children: [_jsxs("legend", { className: "field__label", children: [legend, required && _jsxs(_Fragment, { children: [_jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" }), _jsx("span", { className: "visually-hidden", children: ", required" })] })] }), selectAll && _jsx(Checkbox, { label: selectAll, checked: all, indeterminate: chosen > 0 && !all, onChange: setAll }), list, error ? _jsxs("span", { className: "field-error", id: `${id}-e`, children: [_jsx(ErrorIcon, {}), error] })
                : description ? _jsx("span", { className: "field-help", id: `${id}-h`, children: description }) : null] }));
}
