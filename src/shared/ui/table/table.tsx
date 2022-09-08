import React, { FC, ReactNode, useState } from 'react';
import { useUpdateEffect, useShallowCompareEffect } from 'react-use';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import type { TableCommonProps, Row } from 'react-table';
import { useIntl } from 'react-intl';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { map, pick, assign, isEqual, isArray, isFunction } from 'lodash';
import cx from 'classnames';

import Button from 'shared/ui/button';
import type { TableTypeWorkaround, HeaderPropGetter, ColumnPropGetter, CellPropGetter, RowPropGetter, Column, ColumnActions } from './table.types';

export type { TableTypeWorkaround, HeaderPropGetter, ColumnPropGetter, CellPropGetter, RowPropGetter, Column, ColumnActions };

export interface TableProps<D extends Record<string, unknown> = Record<string, unknown>> {
  getHeaderProps?: HeaderPropGetter<D>;
  getColumnProps?: ColumnPropGetter<D>;
  getCellProps?: CellPropGetter<D>;
  getRowProps?: RowPropGetter<D>;
  columns: ReadonlyArray<Column<D> & { classes?: { header?: string; cell?: string } }>;
  data: ReadonlyArray<D>;
  title?: (data: { rows: ReadonlyArray<Row<D>>; pageOptions: number[]; pageCount: number; pageIndex: number; pageSize: number }) => ReactNode;
  filters?: any[];
  hiddenColumns?: string[];
  sortable?: boolean;
  pagination?: { pageIndex?: number; pageSize?: number } | false | null | undefined;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export type TableClasses = 'root' | 'container' | 'table' | 'thead' | 'tbody' | 'row' | 'column' | 'columnSorted' | 'pagination';

const defaultPaginationState = { pageIndex: 0, pageSize: 10 } as const;

const composePaginationState = (
  dest: { pageIndex: number; pageSize: number },
  ...sources: Array<{ pageIndex?: number; pageSize?: number } | false | null | undefined>
) => {
  return pick(assign(dest, ...sources), ['pageIndex', 'pageSize']) as { pageIndex: number; pageSize: number };
};

// Create a default prop getter
const defaultPropGetter = () => ({});

/** @experimental */
const Table: FC<PropsWithClasses<TableProps<{}>, TableClasses>> = ({
  classes,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  title,
  columns,
  data,
  filters = [],
  hiddenColumns = [],
  sortable,
  pagination,
  onPaginationChange,
}) => {
  const intl = useIntl();
  const [paginationState, setPaginationState] = useState(composePaginationState(defaultPaginationState, pagination));

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    rows,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setHiddenColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // manualFilters: false,
      // defaultCanFilter: true,
      autoResetFilters: true,
      filterTypes: {},
      // manualSortBy: false,
      // defaultCanSort: true,
      autoResetSortBy: false,
      disableMultiSort: true,
      disableSortRemove: false,
      disableMultiRemove: true,
      // defaultColumn: { minWidth: 50, width: 150, maxWidth: 300 },
      initialState: { ...paginationState, filters, hiddenColumns },
    },
    useFilters,
    useSortBy,
    usePagination
  ) as TableTypeWorkaround;

  // Display rows
  const records = pagination ? page : rows;

  useShallowCompareEffect(() => {
    if (isArray(hiddenColumns)) setHiddenColumns(hiddenColumns);
  }, [hiddenColumns]);

  useUpdateEffect(() => {
    const pager = composePaginationState(defaultPaginationState, paginationState, pagination);
    if (pager.pageSize !== pageSize) setPageSize(pager.pageSize);
    if (pager.pageIndex !== pageIndex) gotoPage(pager.pageIndex);
    setPaginationState(pager);
  }, [pagination]);

  useUpdateEffect(() => {
    const pager = { pageIndex, pageSize };
    if (!isEqual(pager, paginationState)) {
      setPaginationState(pager);
      if (isFunction(onPaginationChange)) onPaginationChange(pageIndex, pageSize);
    }
  }, [pageIndex, pageSize, onPaginationChange]);

  // Render the Header
  const renderTitle = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (isFunction(title)) return title({ rows, pageOptions, pageCount, pageIndex, pageSize });
    return null;
  };

  // Render the Table UI
  return (
    <div className={classes?.root}>
      {renderTitle()}

      <div className={classes?.container}>
        <table {...getTableProps({ className: classes?.table })}>
          <thead className={classes?.thead}>
            {map(headerGroups, (headerGroup, rowIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {map(headerGroup.headers, (column, colIndex) => {
                  const columnProps = column as unknown as TableCommonProps & {
                    classes: { header: string; cell: string };
                  };
                  const canSort = column.canSort || column.defaultCanSort;
                  const sorted = sortable && canSort && column.isSorted;
                  return (
                    <th
                      scope="col"
                      tabIndex={-1}
                      aria-colindex={colIndex}
                      {...column.getHeaderProps([
                        sortable ? column?.getSortByToggleProps() : {},
                        {
                          className: cx(classes?.column, columnProps?.className, columnProps?.classes?.header, {
                            [classes?.columnSorted ?? '']: sorted,
                          }),
                          style: columnProps?.style,
                        },
                        getColumnProps(column),
                        getHeaderProps(column),
                        {
                          ...column.getHeaderProps(
                            column.getSortByToggleProps({
                              title: canSort ? intl.formatMessage({ id: 'measures.toggleSortBy' }) : undefined,
                            })
                          ),
                        },
                      ])}
                    >
                      <div className="flex items-center">
                        {column.render('Header')}
                        {/* Add a sort direction indicator */}
                        {sortable && canSort && (
                          <span>
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                              )
                            ) : (
                              <span className="inline-block h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps({ className: classes?.tbody })}>
            {map(records, (row) => {
              prepareRow(row);
              return (
                // Merge row props in
                <tr {...row.getRowProps([{ className: classes?.row }, getRowProps(row)])}>
                  {map(row.cells, (cell, colIndex) => {
                    const { column } = cell;
                    const columnProps = column as unknown as TableCommonProps & {
                      classes: { header: string; cell: string };
                    };
                    return (
                      <td
                        tabIndex={-1}
                        aria-colindex={colIndex}
                        {...cell.getCellProps([
                          {
                            className: cx(classes?.column, columnProps?.className, columnProps?.classes?.cell),
                            style: columnProps?.style,
                          },
                          getColumnProps(column),
                          getCellProps(cell),
                        ])}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className={classes?.pagination}>
          {/* <p className="text-sm">
            Page <span className="font-medium">{+pageIndex + 1}</span> of{' '}
            <span className="font-medium">{pageOptions.length}</span>
          </p> */}

          <p className="text-sm">
            Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
            <span className="font-medium">{pageIndex * pageSize + page?.length}</span> of <span className="font-medium">{rows.length}</span> results
          </p>

          <nav role="navigation" aria-label="Pagination">
            <Button variant="flat" shape="circle" size="xs" disabled={!canPreviousPage} aria-label="First" onClick={() => gotoPage(0)}>
              <span className="sr-only">First</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" focusable="false" />
            </Button>
            <Button variant="flat" shape="circle" size="xs" disabled={!canPreviousPage} aria-label="Previous" onClick={() => previousPage()}>
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" focusable="false" />
            </Button>
            <Button variant="flat" shape="circle" size="xs" disabled={!canNextPage} aria-label="Next" onClick={() => nextPage()}>
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="flat" shape="circle" size="xs" disabled={!canNextPage} aria-label="Last" onClick={() => gotoPage(pageCount - 1)}>
              <span className="sr-only">Last</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};
Table.displayName = 'Table';

export default Table;
