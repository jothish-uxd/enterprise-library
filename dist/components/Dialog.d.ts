import { type ReactNode, type RefObject } from 'react';
/**
 * Dialog — a modal on the native <dialog>. The page behind goes inert, so focus
 * and screen readers stay inside; Escape closes it; focus goes back to whatever
 * opened it. It renders only while open.
 *
 * - Named by its title (an h2) and described by `description`:
 *   "Delete Pilot screening v3?, dialog. 132 candidates' results go with it."
 * - Focus starts on `initialFocus`, else the first control in the body, else the
 *   first action in the footer. For a confirm that destroys something, start on
 *   Cancel and set `alert`, which makes it an
 *   alertdialog so screen readers read the description straight away.
 * - Clicking the backdrop closes it, except an alert, which needs an answer.
 * - size: 'sm' (480px, confirms and short forms), 'lg' (760px) or 'drawer'
 *   (pinned to the right edge, full height, for details and long forms).
 * - The footer holds the actions: the main one last, at the right.
 */
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    /** Short text under the title, read as the dialog's description */
    description?: ReactNode;
    children?: ReactNode;
    /** Actions, right-aligned; put the main action last */
    footer?: ReactNode;
    size?: 'sm' | 'lg' | 'drawer';
    /** alertdialog: for confirms that destroy something. The backdrop doesn't close it. */
    alert?: boolean;
    /** Where focus starts, e.g. the Cancel button of a destructive confirm */
    initialFocus?: RefObject<HTMLElement | null>;
    /** Hide the close (×) button; Escape still closes it */
    hideClose?: boolean;
    className?: string;
}
export declare function Dialog({ open, onClose, title, description, children, footer, size, alert, initialFocus, hideClose, className, }: DialogProps): import("react").JSX.Element | null;
