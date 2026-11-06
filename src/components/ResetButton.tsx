import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTooltip } from './Tooltip';

/**
 * Icon button for the BrowserFrame bar that clears saved changes, after a confirm.
 * The confirm is a small alertdialog anchored under the button: focus starts on
 * Cancel, Escape or a click outside closes it, and the result is announced.
 *
 * - Its name is "Reset {what}", also shown in a tooltip on hover and focus.
 * - confirmVariant 'danger' makes the confirm's Reset button red, for resets
 *   that throw away work people would miss.
 * - disabled: aria-disabled, so it stays in the Tab order and won't open;
 *   disabledReason shows why in the tooltip and is read as its description.
 */
interface Props {
  /** What is being reset, e.g. "lab" or "vault" */
  what: string;
  /** What the reset clears, shown in the confirm */
  description: string;
  /** Announced after resetting */
  done: string;
  /** Where to go after resetting; leave out to stay put */
  to?: string;
  onReset: () => void;
  /** The confirm's Reset button. Default 'primary'. */
  confirmVariant?: 'primary' | 'danger';
  /** Nothing to reset right now. Stays focusable and won't open; give a reason. */
  disabled?: boolean;
  disabledReason?: string;
}

export default function ResetButton({ what, description, done: doneText, to, onReset, confirmVariant = 'primary', disabled, disabledReason }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState('');
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const reason = disabled ? disabledReason : undefined;
  const tip = useTooltip(open ? null : reason ?? `Reset ${what}`);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [open]);

  const close = () => { setOpen(false); buttonRef.current?.focus(); };
  const reset = () => {
    onReset();
    setOpen(false);
    if (to) navigate(to);
    setDone(doneText);
    buttonRef.current?.focus();
  };

  return (
    <span className="reset">
      <button
        ref={(el) => { buttonRef.current = el; tip.anchorRef.current = el; }}
        type="button"
        className="bframe__btn"
        aria-label={`Reset ${what}`}
        aria-describedby={reason ? tip.describedBy : undefined}
        aria-disabled={disabled || undefined}
        aria-expanded={open}
        aria-controls={`${id}-confirm`}
        onClick={() => { if (disabled) return; if (open) close(); else setOpen(true); }}
        {...tip.hoverProps}
        {...tip.focusProps}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.75 8a5.25 5.25 0 1 0 1.6-3.78" /><path d="M2.5 2.5v3h3" /></svg>
      </button>
      {open && (
        <div ref={boxRef} id={`${id}-confirm`} className="reset__box" role="alertdialog" aria-labelledby={`${id}-h`} aria-describedby={`${id}-d`}>
          <p id={`${id}-h`} className="reset__title">Reset the {what}?</p>
          <p id={`${id}-d`} className="reset__desc">{description}</p>
          <div className="reset__actions">
            <button type="button" className={`btn btn--${confirmVariant} btn--sm`} onClick={reset}>Reset {what}</button>
            <button ref={cancelRef} type="button" className="btn btn--secondary btn--sm" onClick={close}>Cancel</button>
          </div>
        </div>
      )}
      <span className="visually-hidden" role="status" aria-live="polite">{done}</span>
      {tip.tooltip}
    </span>
  );
}
