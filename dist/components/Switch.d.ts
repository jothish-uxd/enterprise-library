import { type ReactNode } from 'react';
/**
 * Switch — turns one setting on or off, and it takes effect straight away.
 * A native checkbox with role="switch", so screen readers hear
 * "Include image, switch, on" and Space flips it.
 *
 * Unavailable: pass `disabled` and `disabledReason`. The switch stays in the
 * Tab order (aria-disabled, not the disabled attribute), can't be flipped, and
 * a tooltip says why on hover and on focus. Screen readers hear the reason as
 * the switch's description: "Proctoring, switch, off, dimmed. Turn on
 * recording first."
 *
 * Design-system rules
 * - Use a switch for settings that apply the moment they change. Choices sent
 *   with a form are checkboxes.
 * - The label names the setting ("Include image"), not the action, and stays
 *   the same whether it's on or off. `showState` adds "On" or "Off" beside it.
 * - Always say why it's unavailable.
 * - State is shown by the dot's position and the filled track, never colour.
 */
interface SwitchProps {
    label: ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** A line under the label */
    description?: ReactNode;
    /** Show "On" or "Off" beside the label */
    showState?: boolean;
    /** Can't be changed. Stays focusable; give a reason. */
    disabled?: boolean;
    /** Why it can't be changed: shown in a tooltip on hover and focus, and read as its description */
    disabledReason?: ReactNode;
    size?: 'sm' | 'md';
    /** 'start' puts the label first; 'between' also spreads them across the row, for settings lists */
    labelPosition?: 'end' | 'start' | 'between';
    name?: string;
    id?: string;
    className?: string;
}
export declare function Switch({ label, checked, onChange, description, showState, disabled, disabledReason, size, labelPosition, name, id, className, }: SwitchProps): import("react").JSX.Element;
export {};
