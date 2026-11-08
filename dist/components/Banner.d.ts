import { type ReactNode } from 'react';
import { type AlertTone } from './AlertIcon';
/**
 * Banner — a message that needs attention and stays until it's dealt with.
 *
 * - variant 'global': full width at the top of the page, under the header, for
 *   problems with the whole product: "Sign-in is failing for some people."
 *   Tinted with the tone's background and ruled with its colour.
 * - variant 'inline': inside the content it's about, for problems with one
 *   part: "3 questions have no answer key." Subtler: a hairline box with a
 *   3px bar in the tone's colour.
 * - tone: error, warning, success, info. Each has its own icon shape and a
 *   word for screen readers ("Error:"), so tone never rests on colour. Info
 *   is ink, never coloured.
 * - Announced when it appears: errors right away (role="alert"), the others
 *   politely (role="status"). Focus stays where it is.
 * - `action` (a button or link: "Retry", "Review questions") follows the
 *   message. `onDismiss` adds a close button named "Dismiss"; leave it off for
 *   problems that aren't fixed yet.
 */
export interface BannerProps {
    tone?: AlertTone;
    variant?: 'global' | 'inline';
    /** A short headline, in bold before the message */
    title?: ReactNode;
    /** The message: what happened and what to do */
    children?: ReactNode;
    /** A button or link that fixes it */
    action?: ReactNode;
    onDismiss?: () => void;
    /** Override the announcement: 'assertive' (errors), 'polite' (the rest) or 'off' for a banner on screen when the page loads */
    announce?: 'assertive' | 'polite' | 'off';
    className?: string;
}
export declare function Banner({ tone, variant, title, children, action, onDismiss, announce, className, }: BannerProps): import("react").JSX.Element;
