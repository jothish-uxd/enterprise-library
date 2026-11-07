/**
 * Stepper — where people are in a sequence of steps, and how far each has got:
 * a multi-step form, or work that moves through stages.
 *
 * - variant 'full' (default): every step, numbered, with its status. Steps that
 *   have `to` or `href` are links (a <nav>, current step aria-current="page");
 *   otherwise it's a plain ordered list (current step aria-current="step").
 * - variant 'compact': a segmented bar and "Step 4 of 7: Feature engineering",
 *   for a header or a card where the full list won't fit.
 * - Each step is complete (a filled circle with a check), in progress (a ring)
 *   or not started (a faint ring), and says so to screen readers:
 *   "3. Proctoring, in progress, current step". State is shape and ink, never colour.
 * - orientation 'vertical' stacks the steps with a rule joining them, for a
 *   sidebar beside a long form.
 */
export type StepStatus = 'complete' | 'in-progress' | 'not-started';
export interface Step {
    id: string;
    label: string;
    status: StepStatus;
    /** A router path: makes the step a link */
    to?: string;
    /** A plain link */
    href?: string;
}
export interface StepperProps {
    /** Names the steps, e.g. "Assessment setup" */
    label: string;
    steps: Step[];
    /** The step people are on (or viewing) */
    current: string;
    variant?: 'full' | 'compact';
    orientation?: 'horizontal' | 'vertical';
    /** The word before the number in compact: "Step 3 of 4". Default "Step". */
    unit?: string;
    /** How each status is read out */
    statusText?: Partial<Record<StepStatus, string>>;
    className?: string;
}
export declare function Stepper({ label, steps, current, variant, orientation, unit, statusText, className, }: StepperProps): import("react").JSX.Element;
