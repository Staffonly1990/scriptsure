import React, { FC, useEffect, useState, useMemo } from 'react';
import { useGetSet } from 'react-use';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import { securityModel } from 'features/restrictions';
import { IRole } from 'shared/api/restrictions';
import { CheckCircleIcon, StopIcon } from '@heroicons/react/outline';
import { toJS } from 'mobx';
import Table, { Column } from 'shared/ui/table';
import { useIntl } from 'react-intl';
import { flatten } from 'lodash';

interface IModalRoles {
  restrictedRole?: IRole;
  saveCheckedRoles: (value: { restrictionID?: number; roleID?: number } | any[]) => void;
}

const SettingsSecurityRolesTable: FC<IModalRoles> = observer(({ restrictedRole, saveCheckedRoles }) => {
  const intl = useIntl();
  const [checkedRoles, setCheckedRoles] = useGetSet<[{ restrictionID?: number; roleID?: number }] | any[]>([]);

  const getRestrictions = async (roleId) => {
    try {
      await securityModel.getRestrictions(roleId);
    } catch {}
  };
  useEffect(() => {
    if (securityModel.roleRestriction === null) {
      getRestrictions(restrictedRole?.id);
    }
  }, [restrictedRole]);

  const roleRestriction = toJS(securityModel.roleRestriction);
  useEffect(() => {
    const restrictions = roleRestriction?.map((item) => {
      return item?.Restriction?.map((i) => {
        const roleId = i?.RoleRestriction?.find((role) => role.restrictionID);
        if (i?.RoleRestriction?.length !== 0) return { restrictionID: roleId?.restrictionID, roleID: restrictedRole?.id };
        return null;
      });
    });
    setCheckedRoles(flatten(restrictions).filter((item) => item !== null));
  }, []);

  const toggleRoles = (id) => {
    const isSameRole = !!checkedRoles().find((item) => item.restrictionID === id);
    const filterRoles = checkedRoles().filter((item) => item.restrictionID !== id);
    const newRole = { restrictionID: id, roleID: restrictedRole?.id };
    const newData = isSameRole ? [...filterRoles] : [...checkedRoles(), newRole];

    saveCheckedRoles(newData);
    setCheckedRoles(newData);
  };
  const clearChecked = () => {
    setCheckedRoles([]);
    saveCheckedRoles([]);
  };
  const checkAll = () => {
    const allRoles = roleRestriction?.map((item) =>
      item?.Restriction?.map((role) => {
        return { restrictionID: role.id, roleID: restrictedRole?.id };
      })
    );
    if (allRoles !== undefined) {
      setCheckedRoles(flatten(allRoles));
      saveCheckedRoles(flatten(allRoles));
    }
  };
  const having = (id) => {
    const role = checkedRoles().find((item) => item.restrictionID === id);
    if (role !== undefined) {
      return true;
    }
    return false;
  };
  const columns = useMemo<Array<Column<IRole | any>>>(
    () => [
      {
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({
          id: 'security.rule',
        }),
        id: 'ruleName',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return original.Restriction.map((item, index) => {
            return (
              <div key={index.toString(36)} className="flex items-center">
                <input
                  checked={having(item.id)}
                  id="restrictions"
                  type="checkbox"
                  className="form-checkbox"
                  onChange={() => {
                    // append({ restrictionID: item.id, roleID: restrictedRole?.id, checked: true });
                    toggleRoles(item.id);
                  }}
                />
                <label htmlFor="restrictions" className="form-label">
                  {item.name}
                </label>
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
    roleRestriction !== null ? (
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
        data={roleRestriction}
        sortable
      />
    ) : (
      ''
    );
  return (
    <div>
      <p>
        {intl.formatMessage({
          id: 'security.role',
        })}
      </p>

      {rolesTable}
      <div className="flex m-2">
        <Button shape="smooth" className="m-2" onClick={checkAll}>
          <CheckCircleIcon className="w-6 h-6 mr-2" />
          {intl.formatMessage({
            id: 'security.turn.on.restrictions',
          })}
        </Button>
        <Button shape="smooth" className="m-2" onClick={clearChecked}>
          <StopIcon className="w-6 h-6 mr-2" />
          {intl.formatMessage({
            id: 'security.turn.off.restrictions',
          })}
        </Button>
      </div>
    </div>
  );
});
SettingsSecurityRolesTable.displayName = 'SettingsSecurityRolesTable';
export default SettingsSecurityRolesTable;
