import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
export function SegmentedControl({ label, showLabel, options, value, onChange, iconOnly, size = 'md', fill, name, className = '', }) {
    const id = useId();
    const groupName = name ?? `seg-${id}`;
    const cls = ['segmented', size === 'sm' && 'segmented--sm', iconOnly && 'segmented--icons', fill && 'segmented--fill', className].filter(Boolean).join(' ');
    const group = (_jsx("div", { className: cls, role: "radiogroup", "aria-label": showLabel ? undefined : label, "aria-labelledby": showLabel ? `${id}-l` : undefined, children: options.map((o) => {
            const on = o.value === value;
            return (_jsxs("label", { className: `segmented__opt${on ? ' is-on' : ''}`, title: iconOnly ? o.label : undefined, children: [_jsx("input", { className: "segmented__input", type: "radio", name: groupName, value: o.value, checked: on, disabled: o.disabled, onChange: () => onChange(o.value) }), o.icon && _jsx("span", { className: "segmented__icon", "aria-hidden": "true", children: o.icon }), _jsx("span", { className: iconOnly ? 'visually-hidden' : 'segmented__label', children: o.label }), o.count !== undefined && _jsx("span", { className: "segmented__count", children: o.count })] }, o.value));
        }) }));
    if (!showLabel)
        return group;
    return (_jsxs("div", { className: "segmented-field", children: [_jsx("span", { className: "segmented-field__label", id: `${id}-l`, children: label }), group] }));
}
