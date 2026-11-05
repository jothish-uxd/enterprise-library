import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ResetButton({ what, description, done: doneText, to, onReset }) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState('');
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const cancelRef = useRef(null);
    const boxRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        cancelRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape')
            close(); };
        const onDown = (e) => {
            if (!boxRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target))
                close();
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onDown);
        return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
    }, [open]);
    const close = () => { setOpen(false); buttonRef.current?.focus(); };
    const reset = () => {
        onReset();
        setOpen(false);
        navigate(to);
        setDone(doneText);
        buttonRef.current?.focus();
    };
    return (_jsxs("span", { className: "reset", children: [_jsx("button", { ref: buttonRef, type: "button", className: "bframe__btn", "aria-label": `Reset ${what}`, title: `Reset ${what}`, "aria-expanded": open, "aria-controls": `${id}-confirm`, onClick: () => (open ? close() : setOpen(true)), children: _jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("path", { d: "M2.75 8a5.25 5.25 0 1 0 1.6-3.78" }), _jsx("path", { d: "M2.5 2.5v3h3" })] }) }), open && (_jsxs("div", { ref: boxRef, id: `${id}-confirm`, className: "reset__box", role: "alertdialog", "aria-labelledby": `${id}-h`, "aria-describedby": `${id}-d`, children: [_jsxs("p", { id: `${id}-h`, className: "reset__title", children: ["Reset the ", what, "?"] }), _jsx("p", { id: `${id}-d`, className: "reset__desc", children: description }), _jsxs("div", { className: "reset__actions", children: [_jsxs("button", { type: "button", className: "btn btn--primary btn--sm", onClick: reset, children: ["Reset ", what] }), _jsx("button", { ref: cancelRef, type: "button", className: "btn btn--secondary btn--sm", onClick: close, children: "Cancel" })] })] })), _jsx("span", { className: "visually-hidden", role: "status", "aria-live": "polite", children: done })] }));
}
