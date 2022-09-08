import React, { FC, useState, useMemo } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import Table from 'shared/ui/table';
import { IUser } from 'shared/api/user';
import { useIntl } from 'react-intl';
import { useGetSet } from 'react-use';
import SettingsSecurityPrescribersModal from './setting.security.prescribers.modal';
import { IRole } from 'shared/api/restrictions';

interface IModalUsersTable {
  handleClose: () => void;
  saveCheckedUsers: (value: Partial<IUser>[]) => void;
  checkedRole?: IRole;
  refreshRole: () => void;
}

const SettingsSecurityUsersTable: FC<IModalUsersTable> = observer(({ handleClose, saveCheckedUsers, checkedRole, refreshRole }) => {
  const intl = useIntl();

  const [checkedPrescribers, setCheckedPrescribers] = useGetSet<Partial<IUser>[]>(checkedRole?.Users || []);
  const isCheckedPrescribers = (users) => {
    setCheckedPrescribers(users);
  };

  const removeUser = (id) => {
    const nonRemovedUser = checkedPrescribers().filter((item) => item.id !== id);
    setCheckedPrescribers(nonRemovedUser);
  };
  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({
          id: 'name',
        }),
        accessor: 'fullName',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({
          id: 'user.type',
        }),
        accessor: 'userType',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({
          id: 'npi',
        }),
        accessor: 'npi',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({
          id: 'email',
        }),
        accessor: 'email',
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
          return (
            <span className="sr-only">
              {intl.formatMessage({
                id: 'delete',
              })}
            </span>
          );
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <Button shape="smooth" onClick={() => removeUser(original.id)}>
              {intl.formatMessage({
                id: 'delete',
              })}
            </Button>
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
  const usersTable =
    checkedPrescribers().length !== 0 ? (
      <Table
        classes={{
          root: 'sheet __border h-80 overflow-auto',
          container: 'sheet_container',
          table: 'sheet-table',
          thead: 'sheet-table_thead',
          row: 'sheet-table_row',
          column: 'sheet-table_column',
          columnSorted: '__sorted',
          pagination: 'sheet-pagination',
        }}
        columns={columns}
        data={checkedPrescribers()}
        pagination={{ pageIndex: 0, pageSize: 30 }}
        sortable
      />
    ) : (
      <p>
        {intl.formatMessage({
          id: 'security.no.users',
        })}
      </p>
    );
  return (
    <div>
      <div className="flex justify-between items-center">
        {checkedPrescribers().length !== 0 && (
          <p>
            {intl.formatMessage({
              id: 'security.users.in.role',
            })}
          </p>
        )}
        <SettingsSecurityPrescribersModal isCheckedPrescribers={isCheckedPrescribers} checkedPrescribers={checkedRole?.Users} />
      </div>
      <div>
        {usersTable}
        <div className="flex justify-end mt-3">
          <Button shape="smooth" color="gray" variant="outlined" className="m-3" onClick={handleClose}>
            {intl.formatMessage({
              id: 'cancel',
            })}
          </Button>
          <Button
            className="m-3 mr-0"
            shape="smooth"
            color="green"
            onClick={() => {
              saveCheckedUsers(checkedPrescribers());
              handleClose();
              refreshRole();
            }}
          >
            {intl.formatMessage({
              id: 'save',
            })}
          </Button>
        </div>
      </div>
    </div>
  );
});
SettingsSecurityUsersTable.displayName = 'SettingsSecurityUsersTable';
export default SettingsSecurityUsersTable;
