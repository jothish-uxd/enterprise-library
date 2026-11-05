import { type ReactNode } from 'react';
/**
 * BrowserFrame — a plain browser window that fills the space it is given.
 *
 * Use it to present an app inside a page (a product demo, a prototype, a
 * case study) so the app reads as "the product" and the page around it as
 * "the story". Everything inside stays inside: the body scrolls on its own,
 * and Back / Forward only move through pages visited in the frame.
 *
 * Design-system rules
 * - Fill the viewport: wrap it in <BrowserFrame.Stage> so the frame takes the
 *   height under the site header and the page itself never scrolls.
 * - Keep the bar quiet: dots are decoration (aria-hidden); controls are real
 *   buttons with names; the address is read-only text.
 * - One menu button, inside the bar, for small screens. The panel it opens
 *   must render inside the frame body.
 */
export interface FrameNav {
    canBack: boolean;
    canForward: boolean;
    onBack: () => void;
    onForward: () => void;
}
export interface FrameMenu {
    open: boolean;
    onToggle: () => void;
    /** id of the panel the button opens */
    controls: string;
}
export interface BrowserFrameProps {
    /** Path shown after the host in the address bar */
    path: string;
    host?: string;
    nav?: FrameNav;
    menu?: FrameMenu;
    /** Right end of the bar, e.g. a signed-in avatar */
    end?: ReactNode;
    children: ReactNode;
}
declare function BrowserFrame({ path, host, nav, menu, end, children }: BrowserFrameProps): import("react").JSX.Element;
declare namespace BrowserFrame {
    var Stage: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
}
export default BrowserFrame;
/**
 * Frame-local history for apps routed with react-router.
 * Back never leaves the frame; it only revisits pages opened inside it.
 * Also closes the small-screen menu and scrolls the body to the top on navigation.
 */
export declare function useFrameHistory(): {
    pathname: string;
    nav: FrameNav;
    menuOpen: boolean;
    setMenuOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    scrollRef: import("react").RefObject<HTMLElement>;
};
