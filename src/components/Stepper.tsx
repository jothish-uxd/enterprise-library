import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Stepper — where people are in a sequence of steps, and how far each has got:
 * a multi-step form, or work that moves through stages.
 *
 * - variant 'full' (default): every step, numbered, with its status. Steps that
 *   have `to` or `href` are links (a <nav>, current step aria-current="page");
 *   otherwise it's a plain ordered list (current step aria-current="step").
 * - variant 'compact': a segmented bar and "Step 4 of 7: Feature engineering",
 *   for a header or a card where the full list won't fit.
 * - Each step is complete (a filled circle with a check), in progress (a ring)
 *   or not started (a faint ring), and says so to screen readers:
 *   "3. Proctoring, in progress, current step". State is shape and ink, never colour.
 * - orientation 'vertical' stacks the steps with a rule joining them, for a
 *   sidebar beside a long form.
 */
export type StepStatus = 'complete' | 'in-progress' | 'not-started';

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
  /** A router path: makes the step a link */
  to?: string;
  /** A plain link */
  href?: string;
}

export interface StepperProps {
  /** Names the steps, e.g. "Assessment setup" */
  label: string;
  steps: Step[];
  /** The step people are on (or viewing) */
  current: string;
  variant?: 'full' | 'compact';
  orientation?: 'horizontal' | 'vertical';
  /** The word before the number in compact: "Step 3 of 4". Default "Step". */
  unit?: string;
  /** How each status is read out */
  statusText?: Partial<Record<StepStatus, string>>;
  className?: string;
}

const CHECK = <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 8.5 2.6 2.5L12 5.5" /></svg>;
const DEFAULT_TEXT: Record<StepStatus, string> = { complete: 'complete', 'in-progress': 'in progress', 'not-started': 'not started' };

export function Stepper({
  label, steps, current, variant = 'full', orientation = 'horizontal', unit = 'Step', statusText, className = '',
}: StepperProps) {
  const text = { ...DEFAULT_TEXT, ...statusText };
  const at = Math.max(0, steps.findIndex((s) => s.id === current));

  if (variant === 'compact') {
    const s = steps[at];
    return (
      <p className={['stepper', 'stepper--compact', className].filter(Boolean).join(' ')}>
        <span className="stepper__bar" aria-hidden="true">
          {steps.map((x, n) => (
            <span key={x.id} className={x.status === 'complete' ? 'is-complete' : n === at ? 'is-current' : ''} />
          ))}
        </span>
        <span className="stepper__text">
          <span className="stepper__count">{unit} {at + 1} of {steps.length}<span className="visually-hidden">:</span></span>
          {' '}{s?.label}
          <span className="visually-hidden">, {s ? text[s.status] : ''}</span>
        </span>
      </p>
    );
  }

  const links = steps.some((s) => s.to || s.href);
  const list = (
    <ol className="stepper__list" aria-label={links ? undefined : label}>
      {steps.map((s, i) => {
        const isCurrent = i === at;
        const inner: ReactNode = (
          <>
            <span className="stepper__num" aria-hidden="true">{s.status === 'complete' ? CHECK : i + 1}</span>
            <span className="stepper__label">
              <span className="visually-hidden">{i + 1}. </span>{s.label}
              <span className="visually-hidden">, {text[s.status]}</span>
            </span>
          </>
        );
        const cls = ['stepper__step', `is-${s.status}`, isCurrent && 'is-current'].filter(Boolean).join(' ');
        const currentAttr = isCurrent ? (links ? 'page' : 'step') : undefined;
        return (
          <li key={s.id} className="stepper__item">
            {s.to ? <Link className={cls} to={s.to} aria-current={currentAttr}>{inner}</Link>
              : s.href ? <a className={cls} href={s.href} aria-current={currentAttr}>{inner}</a>
              : <span className={cls} aria-current={currentAttr}>{inner}</span>}
          </li>
        );
      })}
    </ol>
  );
  const cls = ['stepper', orientation === 'vertical' && 'stepper--vertical', className].filter(Boolean).join(' ');
  return links ? <nav className={cls} aria-label={label}>{list}</nav> : <div className={cls}>{list}</div>;
}
