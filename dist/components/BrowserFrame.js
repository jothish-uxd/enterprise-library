import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
export default function BrowserFrame({ path, host = 'example.app', nav, menu, end, children }) {
    return (_jsxs("div", { className: "bframe", children: [_jsxs("div", { className: "bframe__bar", children: [_jsxs("span", { className: "bframe__dots", "aria-hidden": "true", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }), (nav || menu) && (_jsxs("div", { className: "bframe__nav", children: [nav && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "bframe__btn", onClick: nav.onBack, disabled: !nav.canBack, "aria-label": "Back", children: _jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "M10 3 5 8l5 5" }) }) }), _jsx("button", { type: "button", className: "bframe__btn", onClick: nav.onForward, disabled: !nav.canForward, "aria-label": "Forward", children: _jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "m6 3 5 5-5 5" }) }) })] })), menu && (_jsxs("button", { type: "button", className: "bframe__btn bframe__menu", "aria-expanded": menu.open, "aria-controls": menu.controls, onClick: menu.onToggle, children: [_jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "M2.5 4.5h11M2.5 8h11M2.5 11.5h11" }) }), _jsx("span", { className: "visually-hidden", children: "Menu" })] }))] })), _jsxs("div", { className: "bframe__address", "aria-label": "Current address", children: [_jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("rect", { x: "3.5", y: "7", width: "9", height: "6.5", rx: "1.5" }), _jsx("path", { d: "M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" })] }), _jsx("span", { className: "bframe__host", children: host }), _jsx("span", { className: "bframe__path", children: path })] }), end && _jsx("div", { className: "bframe__end", children: end })] }), _jsx("div", { className: "bframe__body", children: children })] }));
}
/** Wrapper that sizes the frame to the viewport under the site header. */
BrowserFrame.Stage = function Stage({ children }) {
    return _jsx("div", { className: "bframe-stage", children: children });
};
/**
 * Frame-local history for apps routed with react-router.
 * Back never leaves the frame; it only revisits pages opened inside it.
 * Also closes the small-screen menu and scrolls the body to the top on navigation.
 */
export function useFrameHistory() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const navType = useNavigationType();
    const [menuOpen, setMenuOpen] = useState(false);
    const scrollRef = useRef(null);
    const [hist, setHist] = useState({ entries: [pathname], index: 0 });
    const travelling = useRef(false);
    useEffect(() => {
        setMenuOpen(false);
        scrollRef.current?.scrollTo({ top: 0 });
        if (travelling.current) {
            travelling.current = false;
            return;
        }
        setHist((h) => {
            if (h.entries[h.index] === pathname)
                return h;
            // A redirect replaces the current page rather than adding one, so Back doesn't bounce.
            if (navType === 'REPLACE') {
                const entries = [...h.entries];
                entries[h.index] = pathname;
                return { entries, index: h.index };
            }
            const entries = [...h.entries.slice(0, h.index + 1), pathname];
            return { entries, index: entries.length - 1 };
        });
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
    const go = useCallback((delta) => {
        const index = hist.index + delta;
        if (index < 0 || index >= hist.entries.length)
            return;
        travelling.current = true;
        setHist({ ...hist, index });
        navigate(hist.entries[index]);
    }, [hist, navigate]);
    const nav = {
        canBack: hist.index > 0,
        canForward: hist.index < hist.entries.length - 1,
        onBack: () => go(-1),
        onForward: () => go(1),
    };
    return { pathname, nav, menuOpen, setMenuOpen, scrollRef };
}
