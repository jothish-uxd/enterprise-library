import { type ReactNode, type ThHTMLAttributes } from 'react';
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
export declare function SortHeader({ children, sort, onSort, numeric, className, ...th }: SortHeaderProps): import("react").JSX.Element;
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
export declare function TableCheck({ checked, indeterminate, onChange, label, header, disabled }: TableCheckProps): import("react").JSX.Element;
interface TableEmptyProps {
    /** Number of columns, so the cell spans the table */
    colSpan: number;
    title: string;
    children?: ReactNode;
    /** Usually one button: clear filters, add the first item */
    action?: ReactNode;
}
export declare function TableEmpty({ colSpan, title, children, action }: TableEmptyProps): import("react").JSX.Element;
export {};
