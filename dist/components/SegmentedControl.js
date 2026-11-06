import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { useTooltip } from './Tooltip';
export function SegmentedControl({ label, showLabel, options, value, onChange, iconOnly, size = 'md', fill, name, className = '', }) {
    const id = useId();
    const groupName = name ?? `seg-${id}`;
    const cls = ['segmented', size === 'sm' && 'segmented--sm', iconOnly && 'segmented--icons', fill && 'segmented--fill', className].filter(Boolean).join(' ');
    const group = (_jsx("div", { className: cls, role: "radiogroup", "aria-label": showLabel ? undefined : label, "aria-labelledby": showLabel ? `${id}-l` : undefined, children: options.map((o) => (_jsx(Option, { option: o, on: o.value === value, name: groupName, iconOnly: iconOnly, onChange: onChange }, o.value))) }));
    if (!showLabel)
        return group;
    return (_jsxs("div", { className: "segmented-field", children: [_jsx("span", { className: "segmented-field__label", id: `${id}-l`, children: label }), group] }));
}
function Option({ option: o, on, name, iconOnly, onChange }) {
    const reason = o.disabled ? o.disabledReason : undefined;
    const tip = useTooltip(reason ?? (iconOnly ? o.label : null));
    const cls = ['segmented__opt', on && 'is-on', o.disabled && 'is-disabled'].filter(Boolean).join(' ');
    return (_jsxs("label", { className: cls, ...tip.hoverProps, children: [_jsx("input", { ref: (el) => { tip.anchorRef.current = el; }, className: "segmented__input", type: "radio", name: name, value: o.value, checked: on, "aria-disabled": o.disabled || undefined, "aria-describedby": reason ? tip.describedBy : undefined, onChange: () => { if (!o.disabled)
                    onChange(o.value); }, onClick: (e) => { if (o.disabled)
                    e.preventDefault(); }, ...tip.focusProps }), o.icon && _jsx("span", { className: "segmented__icon", "aria-hidden": "true", children: o.icon }), _jsx("span", { className: iconOnly ? 'visually-hidden' : 'segmented__label', children: o.label }), o.count !== undefined && _jsx("span", { className: "segmented__count", children: o.count }), tip.tooltip] }));
}
