import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ChipGroup(props) {
    const { label, options, size = 'md', controls, className = '' } = props;
    const isOn = (v) => (props.multiple ? props.value.includes(v) : props.value === v);
    const toggle = (v) => {
        if (props.multiple)
            props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
        else if (props.value !== v)
            props.onChange(v);
    };
    return (_jsx("div", { className: `chips ${className}`.trim(), role: "group", "aria-label": label, children: options.map((o) => (_jsxs("button", { type: "button", className: `chip${size === 'sm' ? ' chip--sm' : ''}`, "aria-pressed": isOn(o.value), "aria-controls": controls, disabled: o.disabled, onClick: () => toggle(o.value), children: [props.multiple && _jsx("svg", { className: "chip__check", viewBox: "0 0 14 14", "aria-hidden": "true", children: _jsx("path", { d: "M3 7.3 5.8 10 11 4" }) }), o.label, o.count !== undefined && _jsx("span", { className: "chip__count", children: o.count })] }, o.value))) }));
}
