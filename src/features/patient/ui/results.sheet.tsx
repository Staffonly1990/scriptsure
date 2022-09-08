import React, { FC, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import Table from 'shared/ui/table';
import type { Column, ColumnActions } from 'shared/ui/table';
import MaskFormat from 'shared/ui/mask.format';
import { OActionStatus } from 'shared/lib/model';
import type { IPatient } from 'shared/api/patient';
import { patientStore, patientDemographicsModel } from '../model';

interface PatientResultsSheetProps {
  data: Partial<IPatient>[];
  actions?: Partial<ColumnActions<IPatient>>;
  showUp?: boolean;
}

const PatientResultsSheet: FC<PatientResultsSheetProps> = (props) => {
  const { showUp, data, actions } = props;
  const intl = useIntl();

  useEffect(() => {
    if (
      (patientDemographicsModel.status.getStatus === OActionStatus.Initial || patientDemographicsModel.errors.getStatus !== null) &&
      !patientDemographicsModel.patientStatuses?.length
    ) {
      patientDemographicsModel.getStatus();
    }
  }, []);

  const columns = useMemo<Array<Column<IPatient>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'sheet.last' }),
        accessor: 'lastName',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'sheet.firstSuffix' }),
        id: 'firstName',
        accessor: 'firstName',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => `${original?.firstName} ${original?.suffix ?? ''}`,
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'sheet.chartId' }),
        id: 'chartId',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        accessor: (original) => original?.chartId || original?.patientId,
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => `${original?.chartId || original?.patientId}`,
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.status' }),
        id: 'status',
        // @ts-ignore
        accessor: 'status',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => patientDemographicsModel.patientStatuses?.[original?.patientStatusId]?.descr,
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'reports.measures.dob' }),
        id: 'dob',
        accessor: 'dob',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat textContent={original?.dob} options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd', outputFormat: 'dd/mm/yyyy' }} unmasked />
        ),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'sheet.phone' }),
        id: 'home',
        accessor: 'home',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => <MaskFormat textContent={original?.home} options={{ mask: '(999) 999-9999' }} />,
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.address' }),
        accessor: 'addressLine1',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.city' }),
        accessor: 'city',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.zip' }),
        accessor: 'zip',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        id: intl.formatMessage({ id: 'measures.actions' }),
        disableSortBy: true,
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
        ...actions,
      },
    ],
    [patientDemographicsModel.patientStatuses, actions, intl]
  );

  return data?.length > 0 || showUp ? (
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
      title={({ rows }) => (
        <p className="sheet-title">
          {intl.formatMessage({ id: 'reports.measures.results' })} ({rows.length})
        </p>
      )}
      columns={columns}
      data={data}
      pagination={{ pageIndex: 0, pageSize: 15 }}
      sortable
    />
  ) : null;
};
PatientResultsSheet.displayName = 'PatientResultsSheet';

export default observer(PatientResultsSheet);
