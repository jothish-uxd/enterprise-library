import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useTooltip } from './Tooltip';

/**
 * Button — the `.btn` classes as a component, with the accessible parts built in.
 *
 * - variant: primary (default; the one main action on a view), secondary,
 *   ghost, danger (red; only the last step of a destructive action).
 * - icon: a 16px outlined icon, before the label or after it (iconPosition).
 *   iconOnly hides the label
 *   visually; it stays the button's name and shows as a tooltip on hover/focus.
 * - pressed: makes it a toggle button (aria-pressed), e.g. "Show archived".
 * - disabled: uses aria-disabled, so the button stays in the Tab order and
 *   clicks do nothing. disabledReason shows why in a tooltip on hover and
 *   focus, and is read as its description: "Publish, button, dimmed. Add a
 *   module before publishing."
 *
 * Plain HTML still works: <button class="btn btn--primary">.
 */
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** An icon, usually an inline SVG drawn with currentColor */
  icon?: ReactNode;
  /** Where the icon sits: 'start' (left, default) or 'end' (right) */
  iconPosition?: 'start' | 'end';
  /** Show only the icon; the label is still its name, and shows as a tooltip */
  iconOnly?: boolean;
  /** A toggle button: true when on, false when off. Leave out for ordinary buttons. */
  pressed?: boolean;
  /** Can't be used right now. Stays focusable; give a reason. */
  disabled?: boolean;
  /** Why it's unavailable: a tooltip on hover and focus, read as its description */
  disabledReason?: ReactNode;
  /** The label */
  children: ReactNode;
}

export function Button({
  variant = 'primary', size = 'md', icon, iconPosition = 'start', iconOnly, pressed, disabled, disabledReason, children,
  className = '', type = 'button', onClick, ...rest
}: ButtonProps) {
  const reason = disabled && disabledReason ? disabledReason : null;
  // One tooltip: the reason when unavailable, otherwise the label for icon-only buttons.
  const tip = useTooltip(reason ?? (iconOnly ? children : null));
  const describedBy = [rest['aria-describedby'], reason ? tip.describedBy : null].filter(Boolean).join(' ') || undefined;
  const cls = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, iconOnly && 'btn--icon', className].filter(Boolean).join(' ');
  return (
    <>
      <button
        {...rest}
        ref={(el) => { tip.anchorRef.current = el; }}
        type={type}
        className={cls}
        aria-pressed={pressed}
        aria-disabled={disabled || undefined}
        aria-describedby={describedBy}
        onClick={(e: MouseEvent<HTMLButtonElement>) => { if (disabled) { e.preventDefault(); return; } onClick?.(e); }}
        {...tip.hoverProps}
        {...tip.focusProps}
      >
        {icon && (iconOnly || iconPosition === 'start') && <span className="btn__icon" aria-hidden="true">{icon}</span>}
        {iconOnly ? <span className="visually-hidden">{children}</span> : children}
        {icon && !iconOnly && iconPosition === 'end' && <span className="btn__icon btn__icon--end" aria-hidden="true">{icon}</span>}
      </button>
      {tip.tooltip}
    </>
  );
}
