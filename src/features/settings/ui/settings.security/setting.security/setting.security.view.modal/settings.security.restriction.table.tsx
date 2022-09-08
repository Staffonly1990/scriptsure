import React, { FC, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { securityModel } from 'features/restrictions';
import { IRole } from 'shared/api/restrictions';
import { toJS } from 'mobx';
import Table, { Column } from 'shared/ui/table';
import { useIntl } from 'react-intl';

interface IRestrictions {
  roleId?: number;
}

const SettingsSecurityRestrictionTable: FC<IRestrictions> = observer(({ roleId }) => {
  const intl = useIntl();

  const getRestrictions = async (id) => {
    try {
      await securityModel.getRestrictions(id);
    } catch {}
  };
  useEffect(() => {
    getRestrictions(roleId);
  }, [roleId]);
  const roleRestrictions = toJS(securityModel.roleRestriction);
  const filterRoles = roleRestrictions?.map((item) => {
    const roles = item?.Restriction?.filter((role) => role.RoleRestriction?.length !== 0);
    return { name: item.name, roles };
  });
  const tableRows = filterRoles?.filter((item) => item?.roles?.length !== 0 && item.roles !== undefined);

  const columns = useMemo<Array<Column<IRole | any>>>(
    () => [
      {
        Header: intl.formatMessage({
          id: 'category',
        }),
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({
          id: 'role.summary',
        }),
        id: 'ruleName',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return original.roles.map((item, index) => {
            return (
              <div key={index.toString(36)} className="flex items-center">
                {item.name}
              </div>
            );
          });
        },
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
    ],
    []
  );
  const rolesTable =
    tableRows?.length !== 0 ? (
      <div>
        <p className="m-3">
          {intl.formatMessage({
            id: 'measures.summary',
          })}
        </p>
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
          data={tableRows !== undefined ? tableRows : []}
          sortable
        />
      </div>
    ) : (
      <p className="text-3xl m-4">
        {intl.formatMessage({
          id: 'no.restrictions',
        })}
      </p>
    );
  return <div>{rolesTable}</div>;
});
SettingsSecurityRestrictionTable.displayName = 'SettingsSecurityRestrictionTable';
export default SettingsSecurityRestrictionTable;
