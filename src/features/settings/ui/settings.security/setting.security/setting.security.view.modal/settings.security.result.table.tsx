import React, { FC, useMemo, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Table, { Column } from 'shared/ui/table';
import { useIntl } from 'react-intl';
import { IRole } from 'shared/api/restrictions';
import { IUser } from 'shared/api/user';

interface ISecurityResultTable {
  restrictedUsers?: IRole | null;
}

const SettingsSecurityResultTable: FC<ISecurityResultTable> = observer(({ restrictedUsers }) => {
  const [role, setRole] = useState(restrictedUsers);
  useEffect(() => {
    setRole(restrictedUsers);
  });
  const intl = useIntl();
  const columns = useMemo<Array<Column<IUser | any>>>(
    () => [
      {
        Header: intl.formatMessage({
          id: 'full.name',
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
      /** no back-end for deleting single-user from Role Security */

      // {
      //   id: 'actions',
      //   // eslint-disable-next-line react/display-name
      //   Header: () => {
      //     return <span className="sr-only">{intl.formatMessage({ id: 'invite.remove' })}</span>;
      //   },
      //   // eslint-disable-next-line react/display-name
      //   Cell: ({ row: { original } }) => {
      //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      //     return (
      //       <Button
      //         onClick={() => {
      //           // addUser.removePractices(practice);
      //         }}
      //         className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
      //         variant="flat"
      //         shape="smooth"
      //         color="gray"
      //         size={breakpoints.lg ? 'md' : 'xs'}
      //       >
      //         <TrashIcon stroke="gray" className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
      //         <span className="hidden lg:inline">{intl.formatMessage({ id: 'invite.remove' })}</span>
      //       </Button>
      //     );
      //   },
      //   classes: {
      //     header: 'sheet-table_header __name',
      //     cell: 'sheet-table_cell __text',
      //   },
      // },
    ],
    []
  );

  const restrictedUsersTable = (
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
      data={role?.Users !== undefined ? role?.Users : []}
      pagination={{ pageIndex: 0, pageSize: 30 }}
      sortable
    />
  );

  return (
    <div>
      {role?.Users?.length !== 0 ? (
        <div>
          <p className="text-xl m-4 mt-0">
            {intl.formatMessage({
              id: 'security.users.in.role',
            })}
          </p>
          {restrictedUsersTable}
        </div>
      ) : (
        <p className="text-3xl m-4">
          {intl.formatMessage({
            id: 'security.no.users',
          })}
        </p>
      )}
    </div>
  );
});
SettingsSecurityResultTable.displayName = 'SettingsSecurityResultTable';
export default SettingsSecurityResultTable;
