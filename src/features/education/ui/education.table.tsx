import React, { FC, useMemo } from 'react';
import { DocumentDownloadIcon, ExclamationIcon } from '@heroicons/react/outline';
import Tooltip from 'shared/ui/tooltip/tooltip';
import Button from 'shared/ui/button/button';
import Table, { Column } from 'shared/ui/table';
import { IEducation } from 'shared/api/education/education.types';
import MaskFormat from 'shared/ui/mask.format';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { toJS } from 'mobx';

import { educationStore } from '../model';
import { useIntl } from 'react-intl';

interface IEduTable {
  sendArchive: (value: IEducation) => void;
  checkedVar: string;
}

const EducationTable: FC<IEduTable> = observer(({ sendArchive, checkedVar }) => {
  const intl = useIntl();
  const columns = useMemo<Array<Column<IEducation>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'measures.dateAdded' }),
        accessor: 'createdAt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat textContent={original?.createdAt} options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd', outputFormat: 'mm/dd/yyyy' }} unmasked />
        ),
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.title' }),
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.status' }),
        accessor: 'archive',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (original.archive === 0 ? 'Current' : 'Archive'),
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'vital.measures.providedBy' }),
        isVisible: false,
        accessor: 'doctorName',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        id: 'actions',
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Header: () => {
          return <span className="sr-only">{intl.formatMessage({ id: 'measures.archived' })}</span>;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          if (original.archive === 0) {
            return (
              <Tooltip content={intl.formatMessage({ id: 'measures.archive' })}>
                <Button
                  shape="circle"
                  color="white"
                  onClick={() => {
                    sendArchive({ ...original, archive: 1, updatedAt: moment().format('YYYY-MM-DD') });
                  }}
                >
                  <DocumentDownloadIcon className="w-6 h-6 !text-blue-500" />
                </Button>
              </Tooltip>
            );
          }
          return '';
        },
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
      },
    ],
    [intl]
  );

  const eduTable =
    toJS(educationStore.list.length) > 0 ? (
      <Table
        classes={{
          root: 'sheet __border',
          container: 'sheet_container',
          table: 'sheet-table',
          thead: 'sheet-table_thead',
          row: 'sheet-table_row',
          column: 'sheet-table_column',
          columnSorted: '__sorted',
          pagination: 'sheet-pagination',
        }}
        columns={columns}
        hiddenColumns={checkedVar === 'current' || checkedVar === 'archived' ? ['archive'] : ['']}
        data={[...toJS(educationStore.list)]}
        sortable
      />
    ) : (
      <div className="flex items-center mt-2 text-gray-300 bg-white drop-shadow-md">
        <ExclamationIcon className="h-28 w-28 mx-8 my-4" />
        <p className="capitalize text-3xl">{intl.formatMessage({ id: 'education.measures.noEducation' })}</p>
      </div>
    );

  return <div>{eduTable}</div>;
});
EducationTable.displayName = 'EducationTable';
export default EducationTable;
