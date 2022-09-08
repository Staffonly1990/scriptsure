import { userModel } from 'features/user';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'shared/ui/button';
import securityModel from 'features/restrictions/model/security.model';
import Table, { Column } from 'shared/ui/table';
import { IRole } from 'shared/api/restrictions';
import { toJS } from 'mobx';
import Tooltip from 'shared/ui/tooltip';
import { useGetSet } from 'react-use';
import { SettingsSecurityAddRolesModal, SettingsSecurityDeleteRoleModal, SettingsSecurityViewModal } from './setting.security';
import { useIntl } from 'react-intl';

const SettingsSecurity: FC = () => {
  const intl = useIntl();
  const userRoles = toJS(securityModel.userRoles);
  const [roles, setRoles] = useState(userRoles);
  const organizationId = userModel.data?.currentOrganization?.id;

  const [isOpenAddRoles, setIsOpenAddRoles] = useGetSet<boolean>(false);
  const getUsersRoles = async (id) => {
    try {
      await securityModel.getRolesUsers(id);
    } catch {}
    setRoles(toJS(securityModel.userRoles));
  };
  const toggleIsOpenAddRoles = (state?: boolean) => {
    const currentState = isOpenAddRoles();
    setIsOpenAddRoles(state ?? !currentState);
    getUsersRoles(organizationId);
  };
  const [isOpenView, setIsOpenView] = useGetSet<boolean>(false);
  const toggleIsOpenView = (state?: boolean) => {
    const currentState = isOpenView();
    setIsOpenView(state ?? !currentState);
    getUsersRoles(organizationId);
  };
  const [isOpenDeleteRole, setIsOpenDeleteRole] = useGetSet<boolean>(false);
  const toggleIsOpenDeleteRole = (state?: boolean) => {
    const currentState = isOpenDeleteRole();
    setIsOpenDeleteRole(state ?? !currentState);
    getUsersRoles(organizationId);
  };
  const [checkedRole, setCheckedRole] = useState<IRole>();
  const getOrganizationId = async () => {
    try {
      await userModel.fetch();
    } catch {}
  };
  useEffect(() => {
    if (userModel.data?.currentOrganization?.id === 0) {
      getOrganizationId();
    }
    if (securityModel.userRoles === null) {
      getUsersRoles(organizationId);
    }
  });

  const columns = useMemo<Array<Column<IRole | any>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'security.roles' }),
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'security.roleID' }),
        accessor: 'id',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        id: 'viewAction',
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Header: () => {
          return <span className="sr-only">{intl.formatMessage({ id: 'security.view.users' })}</span>;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <Tooltip content={intl.formatMessage({ id: 'view.role' })}>
              <Button
                shape="smooth"
                onClick={() => {
                  setCheckedRole(original);
                  toggleIsOpenView(true);
                }}
              >
                {intl.formatMessage({ id: 'security.view' })}
              </Button>
            </Tooltip>
          );
        },
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
      },
      {
        id: 'deleteAction',
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Header: () => {
          return <span className="sr-only">{intl.formatMessage({ id: 'security.delete.role' })}</span>;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <Tooltip content={intl.formatMessage({ id: 'delete.role' })}>
              <Button
                shape="smooth"
                onClick={() => {
                  setCheckedRole(original);
                  toggleIsOpenDeleteRole(true);
                }}
              >
                {intl.formatMessage({ id: 'measures.delete' })}
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
  const rolesTable =
    roles !== null ? (
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
        data={roles}
        pagination={{ pageIndex: 0, pageSize: 15 }}
        sortable
      />
    ) : (
      ''
    );
  return (
    <div className="w-full">
      <p className="text-xl lg:text-2xl font-semibold m-3">
        {intl.formatMessage({
          id: 'security.title',
        })}
      </p>
      <div className="flex items-center m-3">
        <p className="text-xl lg:text-2xl">
          {intl.formatMessage({
            id: 'security.list',
          })}
        </p>
        <Button shape="smooth" className="m-2 ml-10" onClick={() => toggleIsOpenAddRoles(true)}>
          {intl.formatMessage({
            id: 'measures.add',
          })}
        </Button>
      </div>
      {rolesTable}
      <SettingsSecurityAddRolesModal open={isOpenAddRoles()} onClose={toggleIsOpenAddRoles} />
      <SettingsSecurityViewModal open={isOpenView()} onClose={toggleIsOpenView} checkedRole={checkedRole} />
      <SettingsSecurityDeleteRoleModal open={isOpenDeleteRole()} onClose={toggleIsOpenDeleteRole} checkedRole={checkedRole} />
    </div>
  );
};
SettingsSecurity.displayName = 'SettingsSecurity';

export default SettingsSecurity;
