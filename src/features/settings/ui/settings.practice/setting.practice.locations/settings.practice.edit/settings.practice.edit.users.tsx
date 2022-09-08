import React, { FC, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Table, { Column } from 'shared/ui/table';
import { practiceModel } from 'features/practice';
import { toJS } from 'mobx';
import { IPracticeUser, IUser } from 'shared/api/user';
import { useIntl } from 'react-intl';
import { IPractice } from 'shared/api/practice';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@heroicons/react/outline';
import Button from 'shared/ui/button';
import { TrashIcon } from '@heroicons/react/solid';
import SettingsPracticeAddUsersModal from './settings.practice.add.users.modal';

interface IEditUsers {
  changeActiveStep: (value: number) => void;
  handleClose: (value: boolean) => void;
  editable?: boolean;
  changedPractice: any;
}

const SettingsPracticeEditUsers: FC<IEditUsers> = observer(({ editable, handleClose, changeActiveStep, changedPractice }) => {
  const practice = toJS(practiceModel.currentAdminPractice);
  const [practiceUsers, setPracticeUsers] = useState<IPracticeUser[] | any>(practice?.PracticeUsers);
  const [addedUsers, setAddedUsers] = useState<IUser[] | any[]>([]);
  const intl = useIntl();

  const deleteUsers = () => {
    setPracticeUsers([]);
    setAddedUsers([]);
  };
  const savePractice = async () => {
    const editModal = addedUsers.map((item) => {
      return { practiceID: practice?.id, userID: item.id };
    });
    const newModal = addedUsers.map((item) => {
      return { userID: item.id };
    });
    const newPractice = {
      ...changedPractice,
      PracticeUser: editable ? editModal : newModal,
      PracticeUsers: practiceUsers,
    };
    if (editable && practice !== null) {
      try {
        await practiceModel.updateCurrentAdminPractice(practice.id, newPractice);
      } catch {}
    }
    if (!editable) {
      try {
        await practiceModel.addNewPractice(newPractice);
      } catch {}
    }
    handleClose(false);
    changeActiveStep(1);
    deleteUsers();
  };
  console.log(changedPractice);
  const isCheckedPrescribers = (users) => {
    setAddedUsers(users);
  };
  const columns = useMemo<Array<Column<IUser | any>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'last.name' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return original.lastName;
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'first.name' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return original.firstName;
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.type' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return original.userType;
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'npi' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return original.npi;
        },
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'login.measures.email' }),
        id: 'email',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return original.email;
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
    ],
    []
  );
  const usersOnly = practiceUsers.map((item) => {
    return item.user;
  });

  const equalUsers = [...[...usersOnly, ...addedUsers].reduce((acc, curr) => acc.set(curr.id, { ...acc.get(curr.id), ...curr }), new Map()).values()];
  return (
    <div>
      <div className="bg-yellow-500 dark:bg-yellow-200 text-white dark:text-gray-400 text-2xl flex items-center p-5 mb-2 justify-between">
        {intl.formatMessage({ id: 'associated.users' })}
        <div className="flex justify-end">
          <SettingsPracticeAddUsersModal isCheckedPrescribers={isCheckedPrescribers} />
          <Button type="submit" className="m-2 uppercase" color="white" variant="flat" shape="smooth" onClick={deleteUsers}>
            <TrashIcon className="w-6 h-6 mr-2" />
            {intl.formatMessage({ id: 'remove.all' })}
          </Button>
        </div>
      </div>
      <p className="text-xl">{practice?.name}</p>
      {equalUsers.length !== 0 ? (
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
              {intl.formatMessage({ id: 'measures.results' })} ({rows.length})
            </p>
          )}
          columns={columns}
          data={practiceUsers !== undefined ? equalUsers : []}
          pagination={{ pageIndex: 0, pageSize: 15 }}
          sortable
        />
      ) : (
        <p className="text-xl m-3">No associated users</p>
      )}
      <div className="flex justify-between">
        <Button className="m-2" onClick={() => handleClose(false)} shape="smooth" color="gray" variant="flat">
          <XIcon className="w-6 h-6 mr-2" />
          {intl.formatMessage({ id: 'cancel' })}
        </Button>
        <div className="flex justify-end">
          <Button type="submit" className="m-2" shape="smooth" color="gray" variant="flat" onClick={() => changeActiveStep(1)}>
            <ArrowLeftIcon className="w-6 h-6 mr-2" />
            {intl.formatMessage({ id: 'back' })}
          </Button>
          <Button type="submit" className="m-2" shape="smooth" onClick={savePractice}>
            <ArrowRightIcon className="w-6 h-6 mr-2" />
            {intl.formatMessage({ id: 'next' })}
          </Button>
        </div>
      </div>
    </div>
  );
});

SettingsPracticeEditUsers.displayName = 'SettingsPracticeEditUsers';
export default SettingsPracticeEditUsers;
