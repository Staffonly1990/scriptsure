import type { CSSProperties } from 'react';
import type { TableInstance, HeaderGroup, ColumnInstance, Column as _Column, ColumnWithLooseAccessor, Cell, Row } from 'react-table';

export type TableTypeWorkaround<T extends Record<string, unknown> = Record<string, unknown>> = TableInstance<T> & {
  gotoPage: (index: number) => void;
  state: {
    pageIndex: number;
    pageSize: number;
  };
};

export type HeaderPropGetter<D extends Record<string, unknown> = Record<string, unknown>, P extends Record<string, unknown> = Record<string, unknown>> = (
  column: HeaderGroup<D>
) => P;

export type ColumnPropGetter<D extends Record<string, unknown> = Record<string, unknown>, P extends Record<string, unknown> = Record<string, unknown>> = (
  column: ColumnInstance<D>
) => P;

export type CellPropGetter<D extends Record<string, unknown> = Record<string, unknown>, P extends Record<string, unknown> = Record<string, unknown>> = (
  cell: Cell<D>
) => P;

export type RowPropGetter<D extends Record<string, unknown> = Record<string, unknown>, P extends Record<string, unknown> = Record<string, unknown>> = (
  row: Row<D>
) => P;

export type Column<D extends object = {}> = _Column<D> & {
  classes?: { header?: string; cell?: string };
  style?: CSSProperties;
};

export type ColumnActions<D extends object = {}> = ColumnWithLooseAccessor<D> & {
  classes?: { header?: string; cell?: string };
  style?: CSSProperties;
};
