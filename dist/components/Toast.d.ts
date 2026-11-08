import { type ReactNode } from 'react';
import { type AlertTone } from './AlertIcon';
/**
 * Toast — a short result of something people just did ("Assessment
 * duplicated"), shown at the bottom corner and gone after a while. For problems
 * that need attention, use a Banner.
 *
 * Wrap the app in <ToastProvider>, then call `toast()` from useToast():
 *   const { toast } = useToast();
 *   toast({ message: 'Assessment duplicated', action: { label: 'Undo', onClick: undo } });
 *
 * - Announced politely, once, through one live region; focus stays where it is.
 * - Toasts sit in a region named "Notifications", so screen reader users can
 *   jump to it from the landmarks list.
 * - A toast with an action stays until dismissed. Others stay `duration`
 *   (at least 6 seconds), and pause while the pointer is over them or focus is
 *   in them.
 * - At most `max` (3) show at once; the rest collapse into a "2 more" button.
 * - Escape or the close button dismisses one. If focus was in it, it goes back
 *   to where it was before it moved into the toasts.
 * - tone: info (default), success or error, each with its own icon shape and a
 *   word for screen readers. Toasts are ink, whatever the tone.
 */
export interface ToastOptions {
    message: ReactNode;
    tone?: Exclude<AlertTone, 'warning'>;
    /** One action, such as Undo. The toast then stays until dismissed. */
    action?: {
        label: string;
        onClick: () => void;
    };
    /** How long it stays, in ms (at least 6000) */
    duration?: number;
}
interface ToastApi {
    toast: (t: ToastOptions) => number;
    dismiss: (id: number) => void;
}
export declare function useToast(): ToastApi;
export interface ToastProviderProps {
    children?: ReactNode;
    /** Names the region (default "Notifications") */
    label?: string;
    /** How many show at once (default 3) */
    max?: number;
    className?: string;
}
export declare function ToastProvider({ children, label, max, className }: ToastProviderProps): import("react").JSX.Element;
export {};
