import { useEffect, useId, useRef, type FormEvent, type ReactNode } from 'react';
import { AlertIcon } from './AlertIcon';
import { Button } from './Button';

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

const FOCUSABLE = 'input:not([type="hidden"]), select, textarea, button, [tabindex]:not([tabindex="-1"])';

/** Focus a field by id: the element itself, or the first control inside it */
export function focusField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.matches(FOCUSABLE) ? el : el.querySelector<HTMLElement>(FOCUSABLE);
  target?.focus();
  target?.scrollIntoView?.({ block: 'nearest' });
}

export function FormGroup({
  title, description, errors, onSubmit, onCancel, submitLabel = 'Submit', cancelLabel = 'Cancel',
  requiredNote = <>Fields marked <span aria-hidden="true">*</span><span className="visually-hidden">with an asterisk</span> are required.</>,
  headingLevel = 2, children, className = '',
}: FormGroupProps) {
  const id = useId();
  const summary = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const Heading = `h${headingLevel}` as 'h2';
  const many = errors.length >= 2;

  // After a submit, once the new errors have rendered, move focus
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    if (errors.length >= 2) summary.current?.focus();
    else if (errors.length === 1) focusField(errors[0].id);
  }, [errors]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    pending.current = true;
    onSubmit();
    // If the errors didn't change (same list), the effect won't run; move focus now
    requestAnimationFrame(() => {
      if (!pending.current) return;
      pending.current = false;
      if (errors.length >= 2) summary.current?.focus();
      else if (errors.length === 1) focusField(errors[0].id);
    });
  };

  return (
    <form className={['form-group', className].filter(Boolean).join(' ')} noValidate onSubmit={submit} aria-labelledby={`${id}-t`}>
      <header className="form-group__head">
        <Heading className="form-group__title" id={`${id}-t`}>{title}</Heading>
        {description && <p className="form-group__desc">{description}</p>}
        {requiredNote && <p className="form-group__note">{requiredNote}</p>}
      </header>

      {many && (
        <div
          ref={summary}
          className="form-group__summary"
          tabIndex={-1}
          role="group"
          aria-labelledby={`${id}-s`}
          aria-describedby={`${id}-l`}
          onKeyDown={(e) => {
            // Tab from the summary itself goes straight to the first field with an error
            if (e.key === 'Tab' && !e.shiftKey && e.target === summary.current) { e.preventDefault(); focusField(errors[0].id); }
          }}
        >
          <AlertIcon tone="error" />
          <div className="form-group__summary-text">
            <p className="form-group__summary-title" id={`${id}-s`}>
              <span className="visually-hidden">Error: </span>Fix {errors.length} problems before you submit
            </p>
            <ul className="form-group__summary-list" id={`${id}-l`}>
              {errors.map((er) => (
                <li key={er.id}>
                  <a href={`#${er.id}`} onClick={(e) => { e.preventDefault(); focusField(er.id); }}>{er.message}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="form-group__body">{children}</div>

      <div className="form-group__foot">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button>}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export interface FormSectionProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A section of a form group: a fieldset named by its title */
export function FormSection({ title, description, children, className = '' }: FormSectionProps) {
  return (
    <fieldset className={['form-section', className].filter(Boolean).join(' ')}>
      <legend className="form-section__title">{title}</legend>
      {description && <p className="form-section__desc">{description}</p>}
      <div className="form-section__fields">{children}</div>
    </fieldset>
  );
}
