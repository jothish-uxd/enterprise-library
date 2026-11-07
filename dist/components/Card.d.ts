import { type ElementType, type ReactNode } from 'react';
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
export declare function Card({ title, headingLevel, meta, end, footer, children, variant, compact, as: Tag, className }: CardProps): import("react").JSX.Element;
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
export declare function ChoiceCard({ type, name, value, checked, onChange, title, description, meta, icon, disabled, disabledReason, compact, className }: ChoiceCardProps): import("react").JSX.Element;
export {};
