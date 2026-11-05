import { useEffect, useRef, type ReactNode, type ThHTMLAttributes } from 'react';

/**
 * Table helpers for the hairline `.table`.
 *
 * - SortHeader: a column header that sorts. The <th> carries aria-sort, the
 *   button inside it carries the name, so screen readers hear
 *   "Score, sorted descending, button".
 * - TableCheck: the checkbox for a selectable row, or the header's select-all
 *   (with the mixed state when only some rows are chosen).
 * - TableEmpty: the one row a table shows when nothing matches.
 */

export type SortDirection = 'ascending' | 'descending';

interface SortHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'onChange'> {
  children: ReactNode;
  /** Direction when this column is the sorted one; undefined when it isn't */
  sort?: SortDirection;
  /** Called with the next direction: unsorted or descending → ascending, ascending → descending */
  onSort: (next: SortDirection) => void;
  /** Right-align for number columns */
  numeric?: boolean;
}

export function SortHeader({ children, sort, onSort, numeric, className = '', ...th }: SortHeaderProps) {
  const next: SortDirection = sort === 'ascending' ? 'descending' : 'ascending';
  return (
    <th scope="col" aria-sort={sort ?? 'none'} className={`${numeric ? 'num ' : ''}${className}`.trim() || undefined} {...th}>
      <button type="button" className="table__sort" onClick={() => onSort(next)}>
        {children}
        <svg className="table__sort-icon" viewBox="0 0 12 12" aria-hidden="true">
          {sort === 'ascending' ? <path d="M3 7.5 6 4.5l3 3" />
            : sort === 'descending' ? <path d="M3 4.5 6 7.5l3-3" />
            : <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />}
        </svg>
      </button>
    </th>
  );
}

interface TableCheckProps {
  checked: boolean;
  /** Some rows chosen, not all (select-all only) */
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name, e.g. "Choose Luke Skywalker" or "Choose all 24 candidates" */
  label: string;
  /** Render as <th> (header row) instead of <td> */
  header?: boolean;
  disabled?: boolean;
}

export function TableCheck({ checked, indeterminate = false, onChange, label, header, disabled }: TableCheckProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  const input = <input ref={ref} type="checkbox" checked={checked} disabled={disabled} aria-label={label} onChange={(e) => onChange(e.target.checked)} />;
  return header ? <th scope="col" className="table__check">{input}</th> : <td className="table__check">{input}</td>;
}

interface TableEmptyProps {
  /** Number of columns, so the cell spans the table */
  colSpan: number;
  title: string;
  children?: ReactNode;
  /** Usually one button: clear filters, add the first item */
  action?: ReactNode;
}

export function TableEmpty({ colSpan, title, children, action }: TableEmptyProps) {
  return (
    <tr>
      <td className="table__empty" colSpan={colSpan}>
        <p className="table__empty-title">{title}</p>
        {children && <p className="table__empty-text">{children}</p>}
        {action && <div className="table__empty-action">{action}</div>}
      </td>
    </tr>
  );
}
