import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
const SHOW_DELAY = 150;
const HIDE_DELAY = 120;
const GAP = 8;
export default function HoverCard({ label, children, card, className, onClick }) {
    const id = useId();
    const triggerRef = useRef(null);
    const cardRef = useRef(null);
    const timer = useRef();
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);
    const clear = () => window.clearTimeout(timer.current);
    const show = (delay = SHOW_DELAY) => { clear(); timer.current = window.setTimeout(() => setOpen(true), delay); };
    const hide = (delay = HIDE_DELAY) => { clear(); timer.current = window.setTimeout(() => setOpen(false), delay); };
    useEffect(() => clear, []);
    // Escape dismisses from anywhere while open.
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => { if (e.key === 'Escape') {
            clear();
            setOpen(false);
        } };
        const onScroll = () => setOpen(false);
        document.addEventListener('keydown', onKey);
        document.addEventListener('scroll', onScroll, true);
        return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('scroll', onScroll, true); };
    }, [open]);
    useLayoutEffect(() => {
        if (!open || !triggerRef.current || !cardRef.current) {
            setPos(null);
            return;
        }
        const t = triggerRef.current.getBoundingClientRect();
        const c = cardRef.current.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;
        const above = t.bottom + GAP + c.height > vh - 8 && t.top - GAP - c.height > 8;
        const centre = t.left + t.width / 2;
        const left = Math.min(Math.max(8, centre - c.width / 2), vw - c.width - 8);
        setPos({ top: above ? t.top - GAP - c.height : t.bottom + GAP, left, arrow: centre - left, above });
    }, [open]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: triggerRef, type: "button", className: `hovercard-trigger${className ? ` ${className}` : ''}`, "aria-label": label, "aria-describedby": id, onMouseEnter: () => show(), onMouseLeave: () => hide(), onFocus: () => show(0), onBlur: () => hide(0), onClick: onClick, children: children }), createPortal(_jsx("div", { ref: cardRef, id: id, role: "tooltip", className: `hovercard${pos?.above ? ' is-above' : ''}`, hidden: !open, style: pos ? { top: pos.top, left: pos.left, ['--arrow-x']: `${pos.arrow}px` } : { visibility: 'hidden' }, onMouseEnter: () => clear(), onMouseLeave: () => hide(), children: card }), document.body)] }));
}
