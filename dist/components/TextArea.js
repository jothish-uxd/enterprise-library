import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { useTooltip } from './Tooltip';
const ErrorIcon = () => (_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.2" }), _jsx("path", { d: "M8 4.8v3.6M8 11h.01" })] }));
const chars = (n) => `${n} ${n === 1 ? 'character' : 'characters'}`;
export function TextArea({ label, description, error, required, limit, disabled, disabledReason, width = 'full', id, className = '', readOnly, rows = 3, value, defaultValue, onChange, 'aria-describedby': extraDescribedBy, ...rest }) {
    const auto = useId();
    const fieldId = id ?? `ta-${auto}`;
    const tip = useTooltip(disabled ? disabledReason : null);
    // Count from the controlled value, or follow the text when uncontrolled.
    const [own, setOwn] = useState(String(defaultValue ?? ''));
    const length = (value !== undefined ? String(value) : own).length;
    const left = limit != null ? limit - length : 0;
    const over = limit != null && left < 0;
    const counter = limit == null ? null : over ? `${chars(-left)} too many` : `${chars(left)} left`;
    // Speak only when crossing into "at the limit" or "over".
    const [spoken, setSpoken] = useState('');
    const was = useRef(null);
    const state = limit == null ? 'none' : over ? 'over' : left === 0 ? 'at' : 'under';
    useEffect(() => {
        if (was.current !== null && state !== was.current && (state === 'at' || state === 'over'))
            setSpoken(counter ?? '');
        was.current = state;
    }, [state, counter]);
    const describedBy = [
        error ? `${fieldId}-e` : description ? `${fieldId}-h` : null, counter ? `${fieldId}-c` : null, tip.describedBy, extraDescribedBy,
    ].filter(Boolean).join(' ') || undefined;
    const note = error
        ? _jsxs("span", { className: "field-error", id: `${fieldId}-e`, children: [_jsx(ErrorIcon, {}), error] })
        : description ? _jsx("span", { className: "field-help", id: `${fieldId}-h`, children: description }) : null;
    const cls = ['field', width === 'wide' && 'field--wide', disabled && 'is-disabled', className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cls, ...tip.hoverProps, children: [_jsxs("label", { className: "field__label", htmlFor: fieldId, children: [label, required && _jsx("span", { className: "field__required", "aria-hidden": "true", children: "*" })] }), _jsx("textarea", { ref: (el) => { tip.anchorRef.current = el; }, id: fieldId, rows: rows, ...rest, value: value, defaultValue: value === undefined ? defaultValue : undefined, onChange: (e) => { if (value === undefined)
                    setOwn(e.target.value); onChange?.(e); }, readOnly: readOnly || disabled, "aria-disabled": disabled || undefined, "aria-required": required || undefined, "aria-invalid": error || over ? true : undefined, "aria-describedby": describedBy, ...tip.focusProps }), counter
                ? _jsxs("div", { className: "field__foot", children: [note, _jsx("span", { className: `field__counter${over ? ' is-over' : ''}`, id: `${fieldId}-c`, children: counter })] })
                : note, limit != null && _jsx("span", { className: "visually-hidden", role: "status", "aria-live": "polite", children: spoken }), tip.tooltip] }));
}
