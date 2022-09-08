import React, { FC, useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import { map } from 'lodash';
import { editProfile, EditProfile, userModel } from 'features/user';
import { practiceModel } from 'features/practice';
import { toJS } from 'mobx';
import Table, { Column } from 'shared/ui/table';
import MaskFormat from 'shared/ui/mask.format';
import { IUserPlatform } from 'shared/api/user';
import { ExclamationIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import Tooltip from 'shared/ui/tooltip';
import Select from 'shared/ui/select';
import Dropdown from 'shared/ui/dropdown';
import { useGetSet } from 'react-use';
import { useStateRef } from 'shared/hooks';
import SettingsManageAddUser from './settings.manage.add.user';
import { SettingsManageUserListFilters, SettingsManageUserResendPasswordModal, SettingsManageInactivateModal } from './settings.manage.user.list';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';

const SettingsManageUsersList: FC = observer(() => {
  const intl = useIntl();
  const [selectPractice, setSelectPractice] = useState<number | string>();
  const [checkedUser, setCheckedUser] = useState<IUserPlatform[]>([]);
  const userAdminList = toJS(practiceModel.adminPractice);
  const [manageUser, setManageUser] = useState(userAdminList);
  const [isOpenReinvite, setIsOpenReinvite] = useGetSet<boolean>(false);
  const [isOpenInactivate, setIsOpenInactivate] = useGetSet<boolean>(false);
  const [sendUsers, setSendUsers] = useState<IUserPlatform[] | undefined>([]);
  const [innerRefState, setInnerRef, innerRef] = useStateRef<Nullable<HTMLElement>>(null);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [openEditProfile, setEditProfile] = useState(false);

  const toggleIsOpenReinvite = (state?: boolean) => {
    const currentState = isOpenReinvite();
    setIsOpenReinvite(state ?? !currentState);
  };
  const toggleIsOpenInactivate = (state?: boolean) => {
    const currentState = isOpenInactivate();
    setIsOpenInactivate(state ?? !currentState);
  };
  const fetchUser = async () => {
    try {
      await userModel.fetch();
    } catch {}
  };
  const actionEditProfile = async (id) => {
    try {
      await userModel.getUserDetailFull(id);
      await editProfile.profileValues(userModel.dataPlatform);
      setEditProfile(true);
    } catch {}
  };
  const getUsers = async (practiceId) => {
    try {
      if (practiceId) {
        await practiceModel.getAdminPractice(practiceId);
        setManageUser(toJS(practiceModel.adminPractice));
      }
    } catch {}
  };
  useEffect(() => {
    if (userModel?.data?.practices?.length === 0) {
      fetchUser();
    }
    const practiceID = userModel?.data?.currentPractice?.id;
    setSelectPractice(practiceID);
    if (practiceModel.adminPractice.length === 0) {
      getUsers(practiceID);
    }
  }, []);

  useEffect(() => {
    getUsers(selectPractice);
  }, [selectPractice]);

  const activeUser = manageUser.filter((user) => user.statusText === 'Active User');
  const nonConfirmedUser = manageUser.filter((user) => user.statusText === 'Awaiting Email Confirmation');

  const changePractice = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectPractice(event.target.value);
  };

  const toggleInput = useCallback(
    (data) => {
      const newList = manageUser.filter((item) => item?.firstName?.toLowerCase().includes(data) || item?.lastName?.toLowerCase().includes(data));
      setManageUser(newList);
    },
    [setManageUser]
  );
  const chooseUsers = useCallback(
    (userData) => {
      const sameCheckbox = !!checkedUser?.find((item) => item.id === userData.id);
      const reduceCheckbox = checkedUser?.filter((item) => item.id !== userData.id);
      const addedUsers = [...checkedUser, userData];
      const selectedCheckbox = sameCheckbox ? reduceCheckbox : addedUsers;
      setCheckedUser(selectedCheckbox);
    },
    [checkedUser, setCheckedUser]
  );
  const toggleCheckedFilter = (checkedItems) => {
    //   const statusType = checkedItems.map((type) => {
    //     if (type.title === 'status of user') {
    //       return type.type;
    //     }
    //     return '';
    //   });
    //   const userType = checkedItems.map((type) => {
    //     if (type.title === 'type of user') {
    //       return type.type;
    //     }
    //     return '';
    //   });
    //   // const newTable = manageUser.filter((item) => {
    //   //   const filterStatus =
    //   // });
    //   const filterStatus = manageUser.filter((item) => {
    //     return statusType.filter((type) => item.statusText === type);
    //   });
    //   console.log(filterStatus);
    //   setManageUser(filterStatus);
  };
  const sendSingleUser = (data) => {
    const user = [data];
    setSendUsers(user);
    toggleIsOpenReinvite(true);
  };
  const columns = useMemo<Array<Column<any>>>(
    () => [
      {
        id: 'checkboxPractice',
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Header: () => {
          return <span className="sr-only">check user</span>;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return <input className="form-checkbox" type="checkbox" onClick={() => chooseUsers(original)} />;
        },

        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.status' }),
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <span>{original.statusText}</span>
              {!original.password || original?.password?.length === 0 ? (
                <Button variant="flat" color="blue" size="sm" onClick={() => sendSingleUser(original)}>
                  Reset Password
                </Button>
              ) : (
                ''
              )}
            </div>
          );
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
      },
      {
        Header: intl.formatMessage({ id: 'last.name' }),
        accessor: 'lastName',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'first.name' }),
        accessor: 'firstName',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'administrator.access' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <>
              <span>{original.siteAdministrator ? intl.formatMessage({ id: 'full' }) : ''}</span>
              <span>{original.isBusinessUnitAdmin ? intl.formatMessage({ id: 'basic' }) : ''}</span>
            </>
          );
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'id' }),
        accessor: 'id',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'npi' }),
        accessor: 'npi',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'email' }),
        accessor: 'email',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'user.type' }),
        accessor: 'userType',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      // {
      //   Header: 'role ID',
      //   accessor: '',
      //   classes: {
      //     header: 'sheet-table_header __name break-words',
      //     cell: 'sheet-table_cell __text break-words',
      //   },
      //   style: { minWidth: 200, maxWidth: 200 },
      // },
      // {
      //   Header: 'Practice(s)',
      //   accessor: 'firstName',
      //   classes: {
      //     header: 'sheet-table_header __name break-words',
      //     cell: 'sheet-table_cell __text break-words',
      //   },
      //   style: { minWidth: 200, maxWidth: 200 },
      // },
      {
        Header: intl.formatMessage({ id: 'id.me.status' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return original.emailIdme ? (
            <div>
              <p>Completed:</p>
              <p>{original.emailIdme}</p>
            </div>
          ) : (
            <span className="text-red-500 dark:text-red-300">Incomplete</span>
          );
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.created' }),
        accessor: 'createdAt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat
            textContent={original?.createdAt}
            options={{ alias: 'datetime', inputFormat: 'yyyy-mm-ddTHH:MM:ss', outputFormat: 'dd.mm.yyyy HH:MM' }}
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
        Header: intl.formatMessage({ id: 'measures.endDate' }),
        accessor: 'endDt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat
            // textContent={original?.endDt}
            options={{ alias: 'datetime', inputFormat: 'yyyy-mm-ddTHH:MM:ss', outputFormat: 'dd.mm.yyyy' }}
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
        Header: intl.formatMessage({ id: 'last.login' }),
        accessor: 'lastLogin',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat
            textContent={original?.createdAt}
            options={{ alias: 'datetime', inputFormat: 'yyyy-mm-ddTHH:MM:ss', outputFormat: 'dd.mm.yyyy HH:MM' }}
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
        Header: intl.formatMessage({ id: 'updated.by' }),
        accessor: 'updatedAt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat
            textContent={original?.createdAt}
            options={{ alias: 'datetime', inputFormat: 'yyyy-mm-ddTHH:MM:ss', outputFormat: 'dd.mm.yyyy' }}
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
        id: intl.formatMessage({ id: 'measures.edit' }),
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Header: () => {
          return <span className="sr-only">edit</span>;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <Tooltip content={intl.formatMessage({ id: 'measures.edit' })}>
              <Button shape="round" color="green" onClick={() => actionEditProfile(original.id)}>
                {intl.formatMessage({ id: 'measures.edit' })}
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
    <div ref={setInnerRef}>
      <div className="bg-green-500 dark:bg-green-300 text-white text-xl lg:text-2xl p-5">
        <span>{intl.formatMessage({ id: 'medical.health.practice' })}</span>
        <span> ({userAdminList.length})</span>
      </div>
      <div className="p-2 flex justify-between items-center">
        <div>
          <p>
            {intl.formatMessage({ id: 'medical.health.practice.users' })} ({selectPractice}).
          </p>
          <p>
            {intl.formatMessage({ id: 'prescriber.total' })}: {activeUser.length}. {intl.formatMessage({ id: 'supporting.users.total' })}:{' '}
            {nonConfirmedUser.length}.
          </p>
        </div>
        <div>
          <Dropdown
            list={[
              <Dropdown.Item>{intl.formatMessage({ id: 'export.user.list' })}</Dropdown.Item>,
              <Dropdown.Item>{intl.formatMessage({ id: 'register.all.providers' })}</Dropdown.Item>,
              <Dropdown.Item>{intl.formatMessage({ id: 'setup.user.roles' })}</Dropdown.Item>,
              <Dropdown.Item onClick={() => toggleIsOpenInactivate(true)}>{intl.formatMessage({ id: 'inactivate.all.users' })}</Dropdown.Item>,
            ]}
            placement="bottom-end"
          >
            <Button variant="flat" shape="circle" color="black">
              <DotsVerticalIcon className="w-6 h-6" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div>
        <Select
          className="form-control md:flex-auto md:w-3/6 my-2"
          classes={{ placeholder: 'w-full', options: '!w-auto' }}
          shape="round"
          label={<label className="text-primary form-helper-text flex">{intl.formatMessage({ id: 'reports.measures.practice' })}</label>}
          width="w-40"
          options={map(userModel.data?.practices, (practice) => ({
            value: String(practice?.id),
            label: `${practice?.name} ${practice?.id}`,
          }))}
          onChange={changePractice}
        />
        <SettingsManageUserListFilters toggleInput={toggleInput} toggleCheckedFilter={toggleCheckedFilter} />
        <div className="flex">
          <Button color="green" shape="smooth" className="m-2" onClick={() => setIsOpenUserModal(true)}>
            {intl.formatMessage({ id: 'measures.addUser' })}
          </Button>
          <Button shape="smooth" className="m-2" onClick={() => toggleIsOpenInactivate(true)}>
            {intl.formatMessage({ id: 'inactivate.user' })}
          </Button>
          <Button
            shape="smooth"
            className="m-2"
            onClick={() => {
              setSendUsers(checkedUser);
              toggleIsOpenReinvite(true);
            }}
          >
            {intl.formatMessage({ id: 'reset.password' })}
          </Button>
          <Button
            shape="smooth"
            className="m-2 mr-0"
            onClick={() => {
              setSendUsers(checkedUser);
              toggleIsOpenReinvite(true);
            }}
          >
            {intl.formatMessage({ id: 'reset.invite' })}
          </Button>
        </div>
        {manageUser.length > 0 ? (
          <div className="lg:w-3/6">
            <div className="bg-blue-500 dark:bg-blue-300 text-white text-xl lg:text-2xl p-5">
              <span>{intl.formatMessage({ id: 'users' })}</span>
            </div>
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
              data={[...manageUser]}
              sortable
            />
          </div>
        ) : (
          <div className="flex items-center mt-2 text-gray-300 bg-white drop-shadow-md">
            <ExclamationIcon className="h-28 w-28 mx-8 my-4" />
            <p className="capitalize text-3xl">{intl.formatMessage({ id: 'no.users' })}</p>
          </div>
        )}
        {/* {userAdminList.length === 0 ? (
          <div className="flex items-center mt-2 text-gray-300 bg-white drop-shadow-md">
            <ExclamationIcon className="h-28 w-28 mx-8 my-4" />
            <p className="capitalize text-3xl">{intl.formatMessage({ id: 'no.users' })}</p>
          </div>
        ) : (
          ''
        )} */}
      </div>
      <SettingsManageUserResendPasswordModal open={isOpenReinvite()} users={sendUsers} onClose={toggleIsOpenReinvite} />
      <SettingsManageInactivateModal open={isOpenInactivate()} onClose={toggleIsOpenInactivate} selectedPractice={selectPractice} innerRef={innerRef} />

      <Modal open={isOpenUserModal} onClose={() => setIsOpenUserModal(false)}>
        <Modal.Body>
          <SettingsManageAddUser />
        </Modal.Body>
      </Modal>

      <EditProfile open={openEditProfile} setOpen={setEditProfile} />
    </div>
  );
});

SettingsManageUsersList.displayName = 'SettingsManageUsersList';
export default SettingsManageUsersList;
