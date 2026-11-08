import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { AlertIcon } from './AlertIcon';
import { Button } from './Button';
const FOCUSABLE = 'input:not([type="hidden"]), select, textarea, button, [tabindex]:not([tabindex="-1"])';
/** Focus a field by id: the element itself, or the first control inside it */
export function focusField(id) {
    const el = document.getElementById(id);
    if (!el)
        return;
    const target = el.matches(FOCUSABLE) ? el : el.querySelector(FOCUSABLE);
    target?.focus();
    target?.scrollIntoView?.({ block: 'nearest' });
}
export function FormGroup({ title, description, errors, onSubmit, onCancel, submitLabel = 'Submit', cancelLabel = 'Cancel', requiredNote = _jsxs(_Fragment, { children: ["Fields marked ", _jsx("span", { "aria-hidden": "true", children: "*" }), _jsx("span", { className: "visually-hidden", children: "with an asterisk" }), " are required."] }), headingLevel = 2, children, className = '', }) {
    const id = useId();
    const summary = useRef(null);
    const pending = useRef(false);
    const Heading = `h${headingLevel}`;
    const many = errors.length >= 2;
    // After a submit, once the new errors have rendered, move focus
    useEffect(() => {
        if (!pending.current)
            return;
        pending.current = false;
        if (errors.length >= 2)
            summary.current?.focus();
        else if (errors.length === 1)
            focusField(errors[0].id);
    }, [errors]);
    const submit = (e) => {
        e.preventDefault();
        pending.current = true;
        onSubmit();
        // If the errors didn't change (same list), the effect won't run; move focus now
        requestAnimationFrame(() => {
            if (!pending.current)
                return;
            pending.current = false;
            if (errors.length >= 2)
                summary.current?.focus();
            else if (errors.length === 1)
                focusField(errors[0].id);
        });
    };
    return (_jsxs("form", { className: ['form-group', className].filter(Boolean).join(' '), noValidate: true, onSubmit: submit, "aria-labelledby": `${id}-t`, children: [_jsxs("header", { className: "form-group__head", children: [_jsx(Heading, { className: "form-group__title", id: `${id}-t`, children: title }), description && _jsx("p", { className: "form-group__desc", children: description }), requiredNote && _jsx("p", { className: "form-group__note", children: requiredNote })] }), many && (_jsxs("div", { ref: summary, className: "form-group__summary", tabIndex: -1, role: "group", "aria-labelledby": `${id}-s`, "aria-describedby": `${id}-l`, onKeyDown: (e) => {
                    // Tab from the summary itself goes straight to the first field with an error
                    if (e.key === 'Tab' && !e.shiftKey && e.target === summary.current) {
                        e.preventDefault();
                        focusField(errors[0].id);
                    }
                }, children: [_jsx(AlertIcon, { tone: "error" }), _jsxs("div", { className: "form-group__summary-text", children: [_jsxs("p", { className: "form-group__summary-title", id: `${id}-s`, children: [_jsx("span", { className: "visually-hidden", children: "Error: " }), "Fix ", errors.length, " problems before you submit"] }), _jsx("ul", { className: "form-group__summary-list", id: `${id}-l`, children: errors.map((er) => (_jsx("li", { children: _jsx("a", { href: `#${er.id}`, onClick: (e) => { e.preventDefault(); focusField(er.id); }, children: er.message }) }, er.id))) })] })] })), _jsx("div", { className: "form-group__body", children: children }), _jsxs("div", { className: "form-group__foot", children: [onCancel && _jsx(Button, { type: "button", variant: "secondary", onClick: onCancel, children: cancelLabel }), _jsx(Button, { type: "submit", children: submitLabel })] })] }));
}
/** A section of a form group: a fieldset named by its title */
export function FormSection({ title, description, children, className = '' }) {
    return (_jsxs("fieldset", { className: ['form-section', className].filter(Boolean).join(' '), children: [_jsx("legend", { className: "form-section__title", children: title }), description && _jsx("p", { className: "form-section__desc", children: description }), _jsx("div", { className: "form-section__fields", children: children })] }));
}
