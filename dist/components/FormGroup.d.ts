import { type ReactNode } from 'react';
/**
 * FormGroup — a whole form: a header, sections of fields, and Cancel and Submit.
 * It owns what happens when people submit with mistakes, so every form handles
 * errors the same way.
 *
 * - Your `onSubmit` checks the values and sets `errors` ({ id, message } per
 *   field, in page order); the fields show their own inline errors.
 * - One error: focus goes straight to that field; its inline error says what
 *   to fix.
 * - Two or more: an error summary appears at the top, under the header, and
 *   takes focus: "Fix 3 problems before you submit", with each problem as a
 *   link to its field. From the summary, Tab goes straight to the first field
 *   with an error (the links stay reachable with Shift+Tab from there, and by
 *   clicking). The inline errors stay too.
 * - Required fields carry an asterisk; a line under the header says so.
 *   Optional fields are left unmarked.
 * - Sections are fieldsets named by their titles (FormSection).
 */
export interface FormError {
    /** The id of the field: an input, a select's button, or a wrapper around a group */
    id: string;
    message: string;
}
export interface FormGroupProps {
    title: ReactNode;
    description?: ReactNode;
    /** The current errors, in page order. Empty when there are none. */
    errors: FormError[];
    /** Check the values and set errors; submit if there are none */
    onSubmit: () => void;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    /** The line about required fields; null to leave it out */
    requiredNote?: ReactNode;
    /** The heading level of the title (sections are one below) */
    headingLevel?: 2 | 3;
    children: ReactNode;
    className?: string;
}
/** Focus a field by id: the element itself, or the first control inside it */
export declare function focusField(id: string): void;
export declare function FormGroup({ title, description, errors, onSubmit, onCancel, submitLabel, cancelLabel, requiredNote, headingLevel, children, className, }: FormGroupProps): import("react").JSX.Element;
export interface FormSectionProps {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    className?: string;
}
/** A section of a form group: a fieldset named by its title */
export declare function FormSection({ title, description, children, className }: FormSectionProps): import("react").JSX.Element;
