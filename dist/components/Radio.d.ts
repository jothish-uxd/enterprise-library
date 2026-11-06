import { type ReactNode } from 'react';
/**
 * Radio — one option among several; choosing it un-chooses the others.
 * Radios always come in a group: use RadioGroup, or give every Radio the same
 * name inside a fieldset with a legend. Never use one alone; for a single
 * yes or no, use a Checkbox.
 *
 * - Its name is the label only; a description is read as its description:
 *   "After review, radio button, checked, 1 of 3. A recruiter checks scores first."
 * - disabled: aria-disabled, so the arrow keys still reach it and can't choose
 *   it; disabledReason shows why in a tooltip on hover and focus.
 * - Required and errors belong to the group, not to one radio (see RadioGroup).
 */
export interface RadioProps {
    label: ReactNode;
    /** Shared by every radio in the group */
    name: string;
    value: string;
    checked: boolean;
    /** Called with this radio's value when it's chosen */
    onChange: (value: string) => void;
    /** A line under the label */
    description?: ReactNode;
    /** Can't be chosen right now. Stays reachable; give a reason. */
    disabled?: boolean;
    disabledReason?: ReactNode;
    id?: string;
    className?: string;
}
export declare function Radio({ label, name, value, checked, onChange, description, disabled, disabledReason, id, className }: RadioProps): import("react").JSX.Element;
