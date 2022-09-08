import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import Button from 'shared/ui/button';
import Table from 'shared/ui/table';
import { ArrowDownIcon } from '@heroicons/react/solid';
import { useIntl } from 'react-intl';

/**
 * @view SettingsTermsOfUse
 */
const SettingsTermsOfUse: FC = observer(() => {
  const intl = useIntl();

  // TODO Chaika сделать запросы на бэк для заполнения таблиц после того, как это будет сделано на бэке
  const mockDocuments = [
    {
      name: 'DAW Systems, Inc. Privacy Policy',
      link: 'DAW Systems, Inc. Privacy Policy',
    },
    {
      name: 'DAW Systems, Inc. User Code of Conduct',
      link: 'DAW Systems, Inc. User Code of Conduct',
    },
    {
      name: 'DAW Systems, Inc. Service Level Agreement',
      link: 'DAW Systems, Inc. Service Level Agreement',
    },
    {
      name: 'DAW Systems, Inc. Agreement & Terms Of Use',
      link: 'DAW Systems, Inc. Agreement & Terms Of Use',
    },
    {
      name: 'DAW Systems, Inc. API Terms Of Use',
      link: 'DAW Systems, Inc. API Terms Of Use',
    },
  ];

  const mockBusiness = [
    {
      date: '',
      signedBy: '',
    },
  ];

  const columnsDocuments = useMemo<any>(
    () => [
      {
        Header: intl.formatMessage({ id: 'settings.name' }),
        id: 'name',
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        id: 'link',
        accessor: 'link',
        Cell: ({ row: { original } }) => (
          <Button variant="filled" shape="smooth">
            <ArrowDownIcon className="w-4 h-4 mr-2" />
            <span>{intl.formatMessage({ id: 'settings.view' })}</span>
          </Button>
        ),
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap uppercase',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
    ],
    []
  );

  const columnsBusiness = useMemo<any>(
    () => [
      {
        Header: intl.formatMessage({ id: 'settings.dateSigned' }),
        id: 'date',
        accessor: 'date',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'settings.signedBy' }),
        id: 'signedBy',
        accessor: 'signedBy',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        id: 'link',
        accessor: 'link',
        Cell: ({ row: { original } }) => (
          <Button variant="filled" shape="smooth">
            <ArrowDownIcon className="w-4 h-4 mr-2" />
            <span>{intl.formatMessage({ id: 'settings.view' })}</span>
          </Button>
        ),
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap uppercase',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
    ],
    []
  );
  return (
    <div className="flex flex-col gap-4">
      <Table
        classes={{
          root: 'sheet __border mt-4',
          container: 'sheet_container',
          table: 'sheet-table',
          thead: 'sheet-table_thead',
          row: 'sheet-table_row',
          column: 'sheet-table_column',
          columnSorted: '__sorted',
          pagination: 'sheet-pagination',
        }}
        title={() => <p className="font-bold text-3xl px-[16px] py-[24px]">{intl.formatMessage({ id: 'settings.documents' })}</p>}
        columns={columnsDocuments}
        data={mockDocuments}
        pagination={{ pageIndex: 0, pageSize: 50 }}
        sortable
      />
      <Table
        classes={{
          root: 'sheet __border mt-4',
          container: 'sheet_container',
          table: 'sheet-table',
          thead: 'sheet-table_thead',
          row: 'sheet-table_row',
          column: 'sheet-table_column',
          columnSorted: '__sorted',
          pagination: 'sheet-pagination',
        }}
        title={() => (
          <div className="font-bold text-3xl px-[16px] py-[24px] flex gap-4">
            <span>{intl.formatMessage({ id: 'settings.businessAssociateAgreement' })}</span>
            <Button variant="filled" shape="smooth">
              <span>{intl.formatMessage({ id: 'settings.updateBAA' })}</span>
            </Button>
          </div>
        )}
        columns={columnsBusiness}
        data={mockBusiness}
        pagination={{ pageIndex: 0, pageSize: 50 }}
        sortable
      />
      <div className="mt-4 flex gap-4 justify-between px-[16px]">
        <span className="font-bold text-3xl">{intl.formatMessage({ id: 'settings.licenceAgreement' })}</span>
        <Button variant="filled" shape="smooth">
          <span>{intl.formatMessage({ id: 'settings.downloadAgreement' })}</span>
        </Button>
      </div>
    </div>
  );
});
SettingsTermsOfUse.displayName = 'SettingsTermsOfUse';

export default SettingsTermsOfUse;
