import { useId, type ReactNode } from 'react';

/**
 * Skeleton — grey shapes where content will appear, in roughly its shape, so
 * the page holds its layout while it loads and doesn't jump when it arrives.
 * For a wait with no content to stand in for, use a Loader.
 *
 * - `lines` of text, with an optional `heading` bar and `avatar` circle;
 *   `rows` repeats the block, for a list.
 * - One role="progressbar" for the whole skeleton, named by `label`
 *   ("Loading candidates"), which is for screen readers only. The shapes are
 *   hidden from them.
 * - The shapes shimmer; with reduced motion they hold still.
 * - Mark the area that's loading with aria-busy, and swap the skeleton for the
 *   content in the same place.
 */
export interface SkeletonProps {
  /** For screen readers: what's loading */
  label: ReactNode;
  /** Lines of text in each row (default 3) */
  lines?: number;
  /** A wider, taller first bar, for a title */
  heading?: boolean;
  /** A circle at the start, for a person or a file */
  avatar?: boolean;
  /** Repeat the block, for a list (default 1) */
  rows?: number;
  className?: string;
}

export function Skeleton({ label, lines = 3, heading, avatar, rows = 1, className = '' }: SkeletonProps) {
  const id = useId();
  return (
    <div className={['skeleton', className].filter(Boolean).join(' ')} role="progressbar" aria-labelledby={id}>
      <span id={id} className="visually-hidden">{label}</span>
      {Array.from({ length: Math.max(1, rows) }, (_, r) => (
        <div key={r} className={['skeleton__row', avatar && 'skeleton__row--avatar'].filter(Boolean).join(' ')} aria-hidden="true">
          {avatar && <span className="skeleton__avatar" />}
          <span className="skeleton__lines">
            {heading && <span className="skeleton__bone skeleton__bone--heading" />}
            {Array.from({ length: Math.max(0, lines) }, (_, i) => <span key={i} className="skeleton__bone" />)}
          </span>
        </div>
      ))}
    </div>
  );
}
