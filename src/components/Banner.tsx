import { type ReactNode } from 'react';
import { AlertIcon, CLOSE_ICON, TONE_WORD, type AlertTone } from './AlertIcon';

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

export function Banner({
  tone = 'info', variant = 'inline', title, children, action, onDismiss, announce, className = '',
}: BannerProps) {
  const live = announce ?? (tone === 'error' ? 'assertive' : 'polite');
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  const cls = ['banner', `banner--${variant}`, `banner--${tone}`, className].filter(Boolean).join(' ');
  return (
    <div className={cls} role={role}>
      <AlertIcon tone={tone} />
      <div className="banner__text">
        <span className="visually-hidden">{TONE_WORD[tone]}: </span>
        {title && <strong className="banner__title">{title}</strong>}
        {title && children ? ' ' : null}
        {children && <span className="banner__message">{children}</span>}
      </div>
      {action && <div className="banner__action">{action}</div>}
      {onDismiss && (
        <button type="button" className="banner__close" aria-label="Dismiss" onClick={onDismiss}>{CLOSE_ICON}</button>
      )}
    </div>
  );
}
