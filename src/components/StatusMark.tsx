import { type ReactNode } from 'react';

/**
 * StatusMark — a status in words, with a small mark that shows the same thing
 * by shape: a dashed ring for not started, half filled for in progress, a check
 * for done. Never colour, and never the mark alone: the words carry the meaning
 * and the mark is hidden from screen readers.
 *
 * Marks are named by shape, so each product maps its own statuses to them:
 * - dashed  not started, pending, draft
 * - ring    open, ready, scheduled
 * - half    in progress, in review, on hold
 * - filled  live, published, active
 * - check   complete, passed, approved
 * - slash   failed, denied, cancelled
 *
 * variant 'badge' puts it in a small bordered box, for a table cell or a card
 * header; a 'check' badge is filled ink. `muted` softens the words for things
 * that are over (closed, archived).
 */
export type StatusMarkShape = 'dashed' | 'ring' | 'half' | 'filled' | 'check' | 'slash';

export interface StatusMarkProps {
  mark: StatusMarkShape;
  /** The status in words: always shown, always read */
  children: ReactNode;
  variant?: 'plain' | 'badge';
  size?: 'sm' | 'md';
  /** Softer words, for statuses that are over */
  muted?: boolean;
  className?: string;
}

const SHAPES: Record<StatusMarkShape, ReactNode> = {
  dashed: <circle cx="7" cy="7" r="5.25" className="status-mark__line" strokeDasharray="2.4 1.8" />,
  ring: <circle cx="7" cy="7" r="5.25" className="status-mark__line" />,
  half: <><circle cx="7" cy="7" r="5.25" className="status-mark__line" /><path d="M7 1.75a5.25 5.25 0 0 1 0 10.5z" className="status-mark__fill" /></>,
  filled: <circle cx="7" cy="7" r="6" className="status-mark__fill" />,
  check: <><circle cx="7" cy="7" r="6" className="status-mark__fill" /><path d="M4.3 7.2l1.8 1.8 3.6-3.8" className="status-mark__tick" /></>,
  slash: <><circle cx="7" cy="7" r="5.25" className="status-mark__line" /><path d="M3.3 10.7l7.4-7.4" className="status-mark__line" /></>,
};

/** Just the mark, for use inside another component such as a Tag */
export function StatusMarkIcon({ mark, className = 'status-mark__icon' }: { mark: StatusMarkShape; className?: string }) {
  return <svg className={className} viewBox="0 0 14 14" aria-hidden="true" focusable="false">{SHAPES[mark]}</svg>;
}

export function StatusMark({ mark, children, variant = 'plain', size = 'md', muted, className = '' }: StatusMarkProps) {
  const cls = ['status-mark', `status-mark--${mark}`, variant === 'badge' && 'status-mark--badge', size === 'sm' && 'status-mark--sm', muted && 'is-muted', className]
    .filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <svg className="status-mark__icon" viewBox="0 0 14 14" aria-hidden="true" focusable="false">{SHAPES[mark]}</svg>
      <span className="status-mark__text">{children}</span>
    </span>
  );
}
