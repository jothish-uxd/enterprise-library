import { useId, type ElementType, type ReactNode } from 'react';
import { useTooltip } from './Tooltip';

/**
 * Card — a bordered surface with an optional header (title, meta, end slot),
 * body and footer. Plain markup; use the classes directly when that's simpler.
 *
 * ChoiceCard — a card that is a real radio or checkbox. The whole card is the
 * hit area; the input sits on top of it, invisible, so the keyboard, form
 * submission and screen readers get the native control. The title is the
 * accessible name, the description its description.
 *
 * Design-system rules
 * - Cards are for things people compare or pick between. A single block of
 *   content is a section with a heading, not a card.
 * - State by shape: the chosen ChoiceCard gets a 2px ink edge and a filled
 *   mark (ring for radio, box for checkbox). Emphasis is an ink border.
 * - Never put a second interactive control inside a ChoiceCard.
 * - An unavailable ChoiceCard uses aria-disabled: still reachable (Tab, or the
 *   arrow keys in a radio group), never chosen, and disabledReason says why in
 *   a tooltip and as its description.
 */

type Variant = 'default' | 'subtle' | 'strong' | 'emphasis';

interface CardProps {
  /** Card title; rendered as a heading at `headingLevel` */
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** One quiet line under the title: owner, date, count */
  meta?: ReactNode;
  /** Right end of the header: a tag, a menu button */
  end?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  variant?: Variant;
  compact?: boolean;
  /** Element for the card itself, e.g. 'li' inside a list */
  as?: ElementType;
  className?: string;
}

export function Card({ title, headingLevel = 3, meta, end, footer, children, variant = 'default', compact, as: Tag = 'div', className = '' }: CardProps) {
  const H = `h${headingLevel}` as ElementType;
  const cls = ['card', variant !== 'default' && `card--${variant}`, compact && 'card--compact', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls}>
      {(title || meta || end) && (
        <div className="card__header">
          <div className="card__heading">
            {title && <H className="card__title">{title}</H>}
            {meta && <p className="card__meta">{meta}</p>}
          </div>
          {end && <div className="card__end">{end}</div>}
        </div>
      )}
      {children && <div className="card__body">{children}</div>}
      {footer && <div className="card__footer">{footer}</div>}
    </Tag>
  );
}

interface ChoiceCardProps {
  type?: 'radio' | 'checkbox';
  /** Shared by every card in a radio group */
  name: string;
  value: string;
  checked: boolean;
  /** Radio: called when chosen. Checkbox: called with the new state. */
  onChange: (checked: boolean, value: string) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Mono line under the description, e.g. labels or an ID */
  meta?: ReactNode;
  /** Small outlined icon before the title */
  icon?: ReactNode;
  /** Can't be chosen right now; stays reachable. Give a reason. */
  disabled?: boolean;
  disabledReason?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function ChoiceCard({ type = 'radio', name, value, checked, onChange, title, description, meta, icon, disabled, disabledReason, compact, className = '' }: ChoiceCardProps) {
  const id = useId();
  const tip = useTooltip(disabled ? disabledReason : null);
  const cls = ['choice-card', `choice-card--${type}`, compact && 'choice-card--compact', checked && 'is-checked', disabled && 'is-disabled', className].filter(Boolean).join(' ');
  return (
    <label className={cls} {...tip.hoverProps}>
      <input
        ref={(el) => { tip.anchorRef.current = el; }}
        className="choice-card__input" type={type} name={name} value={value} checked={checked}
        aria-disabled={disabled || undefined}
        aria-labelledby={`${id}-t`} aria-describedby={[description && `${id}-d`, meta && `${id}-m`, tip.describedBy].filter(Boolean).join(' ') || undefined}
        onChange={(e) => { if (!disabled) onChange(e.target.checked, value); }}
        onClick={(e) => { if (disabled) e.preventDefault(); }}
        {...tip.focusProps}
      />
      <span className="choice-card__head" id={`${id}-t`}>
        {icon && <span className="choice-card__icon" aria-hidden="true">{icon}</span>}
        {title}
      </span>
      <span className="choice-card__mark" aria-hidden="true">
        {type === 'checkbox' && <svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.5l4.5-5" /></svg>}
      </span>
      {description && <span className="choice-card__desc" id={`${id}-d`}>{description}</span>}
      {meta && <span className="choice-card__meta" id={`${id}-m`}>{meta}</span>}
      {tip.tooltip}
    </label>
  );
}
