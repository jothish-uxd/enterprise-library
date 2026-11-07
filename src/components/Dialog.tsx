import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';

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

export function Dialog({
  open, onClose, title, description, children, footer, size = 'sm', alert, initialFocus, hideClose, className = '',
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    ref.current?.showModal();
    // Start on initialFocus, else the first control in the body, else the first
    // action in the footer, and only then the close button.
    const focusable = 'input:not([type="hidden"]), select, textarea, button, [href], [tabindex]:not([tabindex="-1"])';
    const first = initialFocus?.current
      ?? ref.current?.querySelector<HTMLElement>(`.dialog__body :is(${focusable})`)
      ?? ref.current?.querySelector<HTMLElement>(`.dialog__foot :is(${focusable})`);
    first?.focus();
    // Closing removes the dialog; send focus back to what opened it.
    return () => { (opener.current as HTMLElement | null)?.focus?.(); };
  }, [open, initialFocus]);

  if (!open) return null;
  return (
    <dialog
      ref={ref}
      className={['dialog', `dialog--${size}`, className].filter(Boolean).join(' ')}
      role={alert ? 'alertdialog' : undefined}
      aria-modal="true"
      aria-labelledby={`${id}-t`}
      aria-describedby={description ? `${id}-d` : undefined}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current && !alert) onClose(); }}
    >
      <div className="dialog__inner">
        <div className="dialog__head">
          <h2 id={`${id}-t`} className="dialog__title">{title}</h2>
          {!hideClose && (
            <button type="button" className="btn btn--ghost btn--sm btn--icon dialog__close" aria-label="Close" onClick={onClose}>
              <svg className="btn__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          )}
        </div>
        {description && <div id={`${id}-d`} className="dialog__desc">{description}</div>}
        {children && <div className="dialog__body">{children}</div>}
        {footer && <div className="dialog__foot">{footer}</div>}
      </div>
    </dialog>
  );
}
