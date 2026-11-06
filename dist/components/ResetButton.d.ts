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
export default function ResetButton({ what, description, done: doneText, to, onReset, confirmVariant, disabled, disabledReason }: Props): import("react").JSX.Element;
export {};
