import React, { FC, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { UserIcon } from '@heroicons/react/outline';
import { NavLink } from 'react-router-dom';
import { routes } from 'shared/config';
import { toJS } from 'mobx';
import { isBoolean } from 'lodash';

import Modal, { IModalProps } from 'shared/ui/modal';
import Button from 'shared/ui/button';
import Table, { Column } from 'shared/ui/table';
import { IPatient } from 'shared/api/patient';
import MaskFormat from 'shared/ui/mask.format';
import Tooltip from 'shared/ui/tooltip';
import { patientDemographicsModel, patientStore, recentPatientsStore } from 'features/patient';

interface IDuplicateModal extends IModalProps {
  toggleIsOpenAddPatient: (value: boolean) => void;
}

const DuplicateModal: FC<Pick<IDuplicateModal, 'open' | 'unmount' | 'hideBackdrop' | 'onClose' | 'toggleIsOpenAddPatient'>> = observer(
  ({ open, unmount, hideBackdrop, onClose, toggleIsOpenAddPatient }) => {
    const duplicateList = toJS(patientStore.duplicateList);
    const toggleClose = (value: boolean, isCloseAddPatient?: boolean) => {
      if (onClose) {
        onClose(value);
      }
      if (isBoolean(isCloseAddPatient)) {
        toggleIsOpenAddPatient(isCloseAddPatient);
      }
    };

    const handleSelect = (patient: IPatient) => {
      toggleClose(false, false);
      patientStore.cleanUpDuplicateList();
      const patientId = Number(patient?.chartId) || Number(patient?.patientId);
      setTimeout(() => {
        recentPatientsStore.add({
          firstName: patient?.firstName,
          nextOfKinName: patient?.nextOfKinName,
          lastName: patient?.lastName,
          id: patientId,
        });
      }, 0);
    };

    useEffect(() => {
      if (duplicateList.length > 0) {
        toggleClose(true);
      }
    }, [duplicateList.length]);

    const columns = useMemo<Array<Column<IPatient>>>(
      () => [
        {
          Header: 'last',
          accessor: 'lastName',
          classes: {
            header: 'sheet-table_header __name break-words',
            cell: 'sheet-table_cell __text break-words',
          },
          style: { minWidth: 200, maxWidth: 200 },
        },
        {
          Header: 'first suffix',
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
          Header: 'chart id',
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
          Header: 'status',
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
          Header: 'dob',
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
          Header: 'address',
          accessor: 'addressLine1',
          classes: {
            header: 'sheet-table_header __name',
            cell: 'sheet-table_cell __text',
          },
        },
        {
          id: 'actions',
          disableSortBy: true,
          // eslint-disable-next-line react/display-name
          Header: () => {
            return <span className="sr-only">Select</span>;
          },
          // eslint-disable-next-line react/display-name
          Cell: ({ row: { original } }) => {
            const patientId = original?.chartId || original?.patientId;
            return (
              <Tooltip content="Select patient">
                <Button as={NavLink} className="uppercase" color="green" to={routes.chart.path(patientId)} onClick={() => handleSelect(original)}>
                  <UserIcon className="w-6 h-6 pr-1" />
                  Select
                </Button>
              </Tooltip>
            );
          },
          classes: {
            header: 'sheet-table_header',
            cell: 'sheet-table_cell __action',
          },
        },
      ],
      []
    );
    return (
      <Modal as="div" className="sm:!max-w-[100vw] !h-screen !m-0" open={open} unmount={unmount} hideBackdrop={hideBackdrop} onClose={onClose}>
        <Modal.Header>
          <Modal.Title>Duplicate Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body className="h-5/6">
          <div className="flex flex-col justify-between h-full">
            <div>
              <span>
                The same patient has been entered previously. If the patient you are entering appears below, click the SELECT button to load the patient. If you
                want to continue entering the patient click the IGNORE button.
              </span>
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
                title={({ rows }) => <p className="sheet-title">Results ({rows.length})</p>}
                columns={columns}
                data={[...patientStore.duplicateList]}
                pagination={{ pageIndex: 0, pageSize: 15 }}
                sortable
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="w-full">
                <hr />
              </div>
              <div className="flex justify-end pt-1">
                <Button onClick={() => toggleClose(false, true)} className="w-auto">
                  Ignore
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);

DuplicateModal.displayName = 'DuplicateModal';

export default DuplicateModal;
