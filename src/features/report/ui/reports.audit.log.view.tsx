import React, { FC, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { useStateRef } from 'shared/hooks';
import { useGetSet } from 'react-use';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Dropdown from 'shared/ui/dropdown/dropdown';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { CheckCircleIcon, ExclamationIcon, MenuIcon } from '@heroicons/react/outline';
import { ReportsAuditLogFilter } from './reports.audit.log';
import { auditLogModel } from 'features/auditlog';
import { toJS } from 'mobx';
import Table, { Column } from 'shared/ui/table';
import MaskFormat from 'shared/ui/mask.format';
import { userModel } from 'features/user';
import { AjaxResponse } from 'rxjs/ajax';
import { IAuditLogData } from 'shared/api/auditlog';

interface IMeasureAudit {
  onClose?: (value: boolean) => void;
  open: boolean;
}

const ReportsAuditLogView: FC<IMeasureAudit> = observer(({ open, onClose }) => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const [innerRefState, setInnerRef, innerRef] = useStateRef<Nullable<HTMLElement>>(null);
  const practiceID = userModel?.data?.currentPractice?.id;
  useEffect(() => {
    async function fetchUser() {
      try {
        await userModel.fetch();
      } catch {}
    }
    if (userModel?.data !== null) return;
    fetchUser();
  }, []);
  useEffect(() => {
    const user = toJS(userModel.data?.user);
    async function auditData() {
      if (user) {
        try {
          await auditLogModel.searchAuditLog({
            auditLogTypeId: undefined,
            endDate: new Date(),
            lastAuditLogId: -1,
            offset: 0,
            practiceId: practiceID,
            startDate: new Date(),
            users: [user],
          });
        } catch {}
      }
    }
    auditData();
  }, []);
  const auditLogData = toJS(auditLogModel.auditLog);
  const columns = useMemo<Array<Column<IAuditLogData>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'measures.created' }),
        accessor: 'createdAt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat
            textContent={original?.createdAt}
            options={{ alias: 'datetime', inputFormat: 'yyyy-mm-ddThh:MM:ss', outputFormat: 'dd.mm.yyyy hh:MM:ss' }}
            unmasked
          />
        ),
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.description' }),
        accessor: 'description',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.action' }),
        accessor: 'action',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.user' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <p>
            {original.userFirstName} {original.userLastName}
          </p>
        ),
        classes: {
          header: `sheet-table_header __name break-words`,
          cell: `sheet-table_cell __text break-words`,
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.patient' }),
        id: 'doctorName',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <p>
            {original.patientFirstName} {original.patientLastName}
          </p>
        ),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        id: 'valid',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          if (original.validity === 1) {
            return <CheckCircleIcon className="w-6 h-6" />;
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

  const AuditTable =
    auditLogData.length > 0 ? (
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
        data={[...auditLogData]}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        sortable
      />
    ) : (
      <div className="flex items-center mt-2 text-gray-300 bg-white drop-shadow-md">
        <ExclamationIcon className="h-28 w-28 mx-8 my-4" />
        <p className="capitalize text-3xl">{intl.formatMessage({ id: 'measures.noResults' })}</p>
      </div>
    );
  return (
    <Modal innerRef={setInnerRef} open={open} onClose={onClose} className="xs:max-md md:max-w-2xl lg:max-w-6xl">
      <Modal.Header as="h5" className="text-xl text-white">
        <div className="flex items-center ">
          {!breakpoints.lg && (
            <Dropdown list={[<ReportsAuditLogFilter innerRef={innerRef} />]} placement="bottom-start">
              <Tooltip content="Audit Log Menu">
                <Button shape="circle">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </Tooltip>
            </Dropdown>
          )}
          <span>{intl.formatMessage({ id: 'reports.measures.auditLog' })}</span>
        </div>
      </Modal.Header>
      <Modal.Body ref={innerRef}>
        <div className="flex lg:items-start">
          {breakpoints.lg && <ReportsAuditLogFilter innerRef={innerRef} />}
          <div className="md:w-4/6">
            <div className="text-blue-500 w-full p-5">
              <p>{intl.formatMessage({ id: 'reports.measures.results' })}</p>
            </div>
            <div className="m-2">
              <label className="sr-only">{intl.formatMessage({ id: 'measures.search' })}</label>
              <input className="form-input" type="text" placeholder={intl.formatMessage({ id: 'reports.measures.searchResults' })} />
            </div>
            {AuditTable}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

ReportsAuditLogView.displayName = 'ReportsAuditLogView';
export default ReportsAuditLogView;
