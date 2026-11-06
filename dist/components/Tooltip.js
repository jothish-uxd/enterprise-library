import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
const SHOW_DELAY = 150;
const HIDE_DELAY = 120;
const GAP = 8;
function place(trigger, panel) {
    const t = trigger.getBoundingClientRect();
    const c = panel.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const above = t.bottom + GAP + c.height > vh - 8 && t.top - GAP - c.height > 8;
    const centre = t.left + t.width / 2;
    const left = Math.min(Math.max(8, centre - c.width / 2), vw - c.width - 8);
    return { top: above ? t.top - GAP - c.height : t.bottom + GAP, left, arrow: centre - left, above };
}
export function Tooltip(props) {
    return props.trigger === 'click' ? _jsx(ClickTooltip, { ...props }) : _jsx(HoverTooltip, { ...props });
}
/**
 * useTooltip — the hover tooltip's behaviour, for any control that needs one,
 * e.g. explaining why a switch or button is unavailable.
 * Spread `hoverProps` on the area people point at, `focusProps` on the element
 * that takes focus, put `describedBy` in its aria-describedby, attach `anchorRef`
 * to what the arrow should point at, and render `tooltip`.
 * Screen readers hear the text on focus whether or not it's showing.
 */
export function useTooltip(content) {
    const id = useId();
    const anchorRef = useRef(null);
    const panelRef = useRef(null);
    const timer = useRef();
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);
    const clear = () => window.clearTimeout(timer.current);
    const show = (delay = SHOW_DELAY) => { clear(); timer.current = window.setTimeout(() => setOpen(true), delay); };
    const hide = (delay = HIDE_DELAY) => { clear(); timer.current = window.setTimeout(() => setOpen(false), delay); };
    useEffect(() => clear, []);
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
        if (!open || !anchorRef.current || !panelRef.current) {
            setPos(null);
            return;
        }
        setPos(place(anchorRef.current, panelRef.current));
    }, [open]);
    const tooltip = content == null ? null : createPortal(_jsx("div", { ref: panelRef, id: id, role: "tooltip", className: `tooltip${pos?.above ? ' is-above' : ''}`, hidden: !open, style: pos ? { top: pos.top, left: pos.left, ['--arrow-x']: `${pos.arrow}px` } : { visibility: 'hidden' }, onMouseEnter: () => clear(), onMouseLeave: () => hide(), children: content }), document.body);
    return {
        describedBy: content == null ? undefined : id,
        anchorRef,
        hoverProps: { onMouseEnter: () => show(), onMouseLeave: () => hide() },
        focusProps: { onFocus: () => show(0), onBlur: () => hide(0) },
        tooltip,
    };
}
function HoverTooltip({ label, children, content, className, onClick }) {
    const tip = useTooltip(content);
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: (el) => { tip.anchorRef.current = el; }, type: "button", className: `tooltip-trigger${className ? ` ${className}` : ''}`, "aria-label": label, "aria-describedby": tip.describedBy, ...tip.hoverProps, ...tip.focusProps, onClick: onClick, children: children }), tip.tooltip] }));
}
function ClickTooltip({ label, children, content, className }) {
    const id = useId();
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);
    const reposition = useCallback(() => {
        if (triggerRef.current && panelRef.current)
            setPos(place(triggerRef.current, panelRef.current));
    }, []);
    // The native popover owns opening, light dismiss and Escape; mirror its state.
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel)
            return;
        const onToggle = (e) => {
            const isOpen = e.newState === 'open';
            setOpen(isOpen);
            if (!isOpen)
                setPos(null);
        };
        panel.addEventListener('toggle', onToggle);
        return () => panel.removeEventListener('toggle', onToggle);
    }, []);
    useLayoutEffect(() => { if (open)
        reposition(); }, [open, reposition]);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            // Escape closes the popover natively; put focus back on the button.
            if (e.key === 'Escape' && panelRef.current?.contains(document.activeElement))
                triggerRef.current?.focus();
        };
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', reposition);
        document.addEventListener('scroll', reposition, true);
        return () => {
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', reposition);
            document.removeEventListener('scroll', reposition, true);
        };
    }, [open, reposition]);
    const popoverAttrs = { popover: 'auto' };
    const targetAttrs = { popovertarget: id };
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: triggerRef, type: "button", className: `tooltip-trigger${className ? ` ${className}` : ''}`, "aria-label": label, "aria-expanded": open, "aria-controls": id, ...targetAttrs, children: children }), _jsx("div", { ref: panelRef, id: id, className: `tooltip tooltip--click${pos?.above ? ' is-above' : ''}`, "aria-label": label, role: "group", style: pos ? { top: pos.top, left: pos.left, ['--arrow-x']: `${pos.arrow}px` } : { visibility: 'hidden' }, ...popoverAttrs, children: content })] }));
}
/** @deprecated Use Tooltip (trigger="hover"). Kept so 0.1 apps keep working. */
export function HoverCard({ card, ...rest }) {
    return _jsx(Tooltip, { ...rest, content: card });
}
