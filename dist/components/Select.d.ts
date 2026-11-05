export interface SelectOption<T extends string | number> {
    value: T;
    label: string;
}
interface Props<T extends string | number> {
    label: string;
    value: T;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    className?: string;
    /** id of help text that describes the field */
    describedBy?: string;
    /** Show the label beside the button instead of above it */
    inline?: boolean;
    /** Keep the label for screen readers only (the context already names the field) */
    hideLabel?: boolean;
    /** Shown when the value isn't one of the options, e.g. "Select an option" */
    placeholder?: string;
    invalid?: boolean;
    /** id for the button, so error summaries can link to it */
    buttonId?: string;
}
/**
 * Custom dropdown in the a11y-charts style (WAI-ARIA "select-only combobox").
 * The button keeps focus; the list is announced through aria-activedescendant.
 * Keys: Enter, Space, Alt+Down or Down to open; Up/Down, Home/End and typing to move;
 * Enter or Space to choose; Escape to close without choosing; Tab chooses and moves on.
 */
export default function Select<T extends string | number>({ label, value, options, onChange, className, describedBy, inline, hideLabel, placeholder, invalid, buttonId }: Props<T>): import("react").JSX.Element;
export {};
