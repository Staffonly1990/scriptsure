import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import Table from 'shared/ui/table';
import type { ColumnActions } from 'shared/ui/table';
import MaskFormat from 'shared/ui/mask.format';
import { allergyStore } from '../model';
import { getAllergyStatus } from '../lib/history';

interface AllergiesSheetProps {
  data: Partial<any>[];
  actions?: Partial<ColumnActions<any>>;
}

const AllergiesSheet: FC<StyledComponentProps<AllergiesSheetProps>> = (props) => {
  const intl = useIntl();
  const { className, data, actions } = props;

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: 'measures.dateAdded' }),
        accessor: 'createdAt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat textContent={original?.createdAt} options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd', outputFormat: 'dd/mm/yyyy' }} unmasked />
        ),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'allergies.measures.allergy' }),
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.type' }),
        accessor: 'adverseEventCode',
        // @ts-ignore
        // eslint-disable-next-line react/display-name
        Cell: observer(({ row: { original } }) => {
          const adverseEvent = allergyStore.getAllergyAdverseEvent(original.adverseEventCode);
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return adverseEvent?.name ?? null;
        }),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.severity' }),
        accessor: 'severityCode',
        // @ts-ignore
        // eslint-disable-next-line react/display-name
        Cell: observer(({ row: { original } }) => {
          const severity = allergyStore.getSeverity(parseInt(original.severityCode, 10));
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return severity?.severityName ?? null;
        }),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.reaction' }),
        accessor: 'reactionId',
        // @ts-ignore
        // eslint-disable-next-line react/display-name
        Cell: observer(({ row: { original } }) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const reaction = allergyStore.getReaction(parseInt(original.reactionId, 10));
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return reaction?.name ?? null;
        }),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.comment' }),
        accessor: 'comment',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.onsetDate' }),
        accessor: 'onsetDate',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat textContent={original?.onsetDate} options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd', outputFormat: 'dd/mm/yyyy' }} unmasked />
        ),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.endDate' }),
        accessor: 'endDate',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat textContent={original?.endDate} options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd', outputFormat: 'dd/mm/yyyy' }} unmasked />
        ),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.status' }),
        id: 'status',
        accessor: '',
        defaultCanSort: true,
        // @ts-ignore
        sortType: (rowA, rowB, columnId, desc) => {
          const statusA = getAllergyStatus(rowA.original);
          const statusB = getAllergyStatus(rowB.original);
          return statusA?.localeCompare(statusB) ?? 0;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => intl.formatMessage({ id: `allergy.measures.${getAllergyStatus(original)}` }),
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words capitalize',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.recordedBy' }),
        accessor: 'userName',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        id: 'actions',
        disableSortBy: true,
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
        ...actions,
      },
    ],
    [actions, intl]
  );

  return (
    <Table
      classes={{
        root: cx(className, 'sheet'),
        container: 'sheet_container',
        table: 'sheet-table',
        thead: 'sheet-table_thead',
        row: 'sheet-table_row',
        column: 'sheet-table_column',
        columnSorted: '__sorted',
        pagination: 'sheet-pagination',
      }}
      columns={columns}
      data={data}
      pagination={{ pageIndex: 0, pageSize: 15 }}
      sortable
    />
  );
};
AllergiesSheet.displayName = 'AllergiesSheet';

export default observer(AllergiesSheet);
