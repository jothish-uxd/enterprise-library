export type AlertTone = 'error' | 'warning' | 'success' | 'info';
/** What screen readers hear before the message, since the icon is hidden */
export declare const TONE_WORD: Record<AlertTone, string>;
export declare function AlertIcon({ tone }: {
    tone: AlertTone;
}): import("react").JSX.Element;
export declare const CLOSE_ICON: import("react").JSX.Element;
