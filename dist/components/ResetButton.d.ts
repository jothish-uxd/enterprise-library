/**
 * Icon button for the BrowserFrame bar that clears saved changes, after a confirm.
 * The confirm is a small alertdialog anchored under the button: focus starts on
 * Cancel, Escape or a click outside closes it, and the result is announced.
 */
interface Props {
    /** What is being reset, e.g. "lab" or "vault" */
    what: string;
    /** What the reset clears, shown in the confirm */
    description: string;
    /** Announced after resetting */
    done: string;
    /** Where to go after resetting */
    to: string;
    onReset: () => void;
}
export default function ResetButton({ what, description, done: doneText, to, onReset }: Props): import("react").JSX.Element;
export {};
