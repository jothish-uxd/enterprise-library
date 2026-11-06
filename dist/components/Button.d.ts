import type { ButtonHTMLAttributes, ReactNode } from 'react';
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
export declare function Button({ variant, size, icon, iconPosition, iconOnly, pressed, disabled, disabledReason, children, className, type, onClick, ...rest }: ButtonProps): import("react").JSX.Element;
export {};
