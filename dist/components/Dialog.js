import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
export function Dialog({ open, onClose, title, description, children, footer, size = 'sm', alert, initialFocus, hideClose, className = '', }) {
    const ref = useRef(null);
    const id = useId();
    const opener = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        opener.current = document.activeElement;
        ref.current?.showModal();
        // Start on initialFocus, else the first control in the body, else the first
        // action in the footer, and only then the close button.
        const focusable = 'input:not([type="hidden"]), select, textarea, button, [href], [tabindex]:not([tabindex="-1"])';
        const first = initialFocus?.current
            ?? ref.current?.querySelector(`.dialog__body :is(${focusable})`)
            ?? ref.current?.querySelector(`.dialog__foot :is(${focusable})`);
        first?.focus();
        // Closing removes the dialog; send focus back to what opened it.
        return () => { opener.current?.focus?.(); };
    }, [open, initialFocus]);
    if (!open)
        return null;
    return (_jsx("dialog", { ref: ref, className: ['dialog', `dialog--${size}`, className].filter(Boolean).join(' '), role: alert ? 'alertdialog' : undefined, "aria-modal": "true", "aria-labelledby": `${id}-t`, "aria-describedby": description ? `${id}-d` : undefined, onCancel: (e) => { e.preventDefault(); onClose(); }, onClick: (e) => { if (e.target === ref.current && !alert)
            onClose(); }, children: _jsxs("div", { className: "dialog__inner", children: [_jsxs("div", { className: "dialog__head", children: [_jsx("h2", { id: `${id}-t`, className: "dialog__title", children: title }), !hideClose && (_jsx("button", { type: "button", className: "btn btn--ghost btn--sm btn--icon dialog__close", "aria-label": "Close", onClick: onClose, children: _jsx("svg", { className: "btn__icon", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "M4 4l8 8M12 4l-8 8" }) }) }))] }), description && _jsx("div", { id: `${id}-d`, className: "dialog__desc", children: description }), children && _jsx("div", { className: "dialog__body", children: children }), footer && _jsx("div", { className: "dialog__foot", children: footer })] }) }));
}
