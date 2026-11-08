import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from 'react';
import { AlertIcon, CLOSE_ICON, TONE_WORD } from './AlertIcon';
const Ctx = createContext(null);
export function useToast() {
    const api = useContext(Ctx);
    if (!api)
        throw new Error('useToast needs a <ToastProvider> above it');
    return api;
}
const MIN = 6000;
let next = 1;
export function ToastProvider({ children, label = 'Notifications', max = 3, className = '' }) {
    const [items, setItems] = useState([]);
    const [said, setSaid] = useState('');
    const [hover, setHover] = useState(false);
    const [focusIn, setFocusIn] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const region = useRef(null);
    const before = useRef(null);
    const dismiss = useCallback((id) => {
        const inside = region.current?.contains(document.activeElement);
        setItems((all) => all.filter((t) => t.id !== id));
        // A removed element doesn't fire blur, so leave the paused state here
        if (inside) {
            setFocusIn(false);
            requestAnimationFrame(() => { before.current?.focus?.(); });
        }
    }, []);
    const toast = useCallback((t) => {
        const id = next++;
        setItems((all) => [...all, { ...t, id }]);
        // Clear, then set, so the same words are announced again
        setSaid('');
        const text = typeof t.message === 'string' ? t.message : '';
        setTimeout(() => setSaid(`${t.tone && t.tone !== 'info' ? `${TONE_WORD[t.tone]}: ` : ''}${text}${t.action ? `. ${t.action.label} is available in Notifications.` : ''}`), 50);
        return id;
    }, []);
    useEffect(() => { if (items.length <= max)
        setExpanded(false); }, [items.length, max]);
    const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
    const paused = hover || focusIn;
    const shown = expanded ? items : items.slice(-max);
    const more = items.length - shown.length;
    return (_jsxs(Ctx.Provider, { value: api, children: [children, _jsxs("section", { ref: region, className: ['toaster', className].filter(Boolean).join(' '), "aria-label": label, onPointerEnter: () => setHover(true), onPointerLeave: () => setHover(false), onFocus: (e) => {
                    if (!region.current?.contains(e.relatedTarget))
                        before.current = e.relatedTarget;
                    setFocusIn(true);
                }, onBlur: (e) => { if (!region.current?.contains(e.relatedTarget))
                    setFocusIn(false); }, children: [more > 0 && (_jsxs("button", { type: "button", className: "toaster__more", onClick: () => setExpanded(true), children: [more, " more"] })), items.length > 0 && (_jsx("ol", { className: "toaster__list", children: shown.map((t) => _jsx(Toast, { item: t, paused: paused, onDismiss: () => dismiss(t.id) }, t.id)) })), _jsx("div", { className: "visually-hidden", role: "status", "aria-live": "polite", children: said })] })] }));
}
function Toast({ item, paused, onDismiss }) {
    const tone = item.tone ?? 'info';
    const left = useRef(Math.max(MIN, item.duration ?? MIN));
    useEffect(() => {
        if (item.action || paused)
            return;
        const start = Date.now();
        const timer = setTimeout(onDismiss, left.current);
        return () => { clearTimeout(timer); left.current = Math.max(1500, left.current - (Date.now() - start)); };
    }, [paused, item.action, onDismiss]);
    const onKey = (e) => { if (e.key === 'Escape') {
        e.stopPropagation();
        onDismiss();
    } };
    return (_jsxs("li", { className: `toaster__toast toaster__toast--${tone}`, onKeyDown: onKey, children: [_jsx(AlertIcon, { tone: tone }), _jsxs("p", { className: "toaster__message", children: [tone !== 'info' && _jsxs("span", { className: "visually-hidden", children: [TONE_WORD[tone], ": "] }), item.message] }), item.action && (_jsx("button", { type: "button", className: "toaster__action", onClick: () => { item.action.onClick(); onDismiss(); }, children: item.action.label })), _jsx("button", { type: "button", className: "toaster__close", "aria-label": "Dismiss", onClick: onDismiss, children: CLOSE_ICON })] }));
}
