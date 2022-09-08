import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import styles from './prescriber.module.css';
import Modal from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { UserIcon, UserAddIcon, UsersIcon, XIcon, SearchIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { userModel } from 'features/user';
import { currentPrescriber } from '../model';
import { ComponentModel } from 'shared/model';
import { settingsModel } from 'features/settings';
import Tooltip from 'shared/ui/tooltip';
import PopupList from './popup.list';
import { IUser } from 'shared/api/user';
import Spinner from 'shared/ui/spinner';
import { useNotifier } from 'react-headless-notifier';
import Alert from 'shared/ui/alert';
import settingsUserModel from '../../settings/model/settings.user.model';

const Prescriber: FC = observer(() => {
  const [open, updateArgs] = useState(false);
  const [search, setSearch] = useState('');
  const breakpoints = useBreakpoints();
  const [loading, setLoading] = useState(false);
  const { notify } = useNotifier();
  const intl = useIntl();

  const alert = () => {
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        {intl.formatMessage({ id: 'prescriber.measures.prescriberSelected' })}
      </Alert.Notification>
    );
  };

  useEffect(() => {
    currentPrescriber.setDefault(userModel.data?.currentPractice?.prescribers);
  }, [userModel.data?.currentPractice?.prescribers]);

  const handleOpen = () => {
    updateArgs(true);
  };

  const handleClose = () => {
    updateArgs(false);
  };

  const getHiddenComponents = async () => {
    try {
      await ComponentModel.getHiddenComponents(settingsModel.appID);
      await currentPrescriber.setDefault(userModel.data?.currentPractice?.prescribers);
    } catch {}
  };

  const deleteRequest = async (prescriberId?: number) => {
    try {
      await currentPrescriber.deleteRequest(userModel.data?.user.id, prescriberId);
    } catch {}
  };

  const grantAccess = async () => {
    try {
      await currentPrescriber.grantAccess();
    } catch {}
  };

  const requestAccess = async () => {
    try {
      await currentPrescriber.requestAccess(userModel.data?.currentOrganization?.id);
    } catch {}
  };

  const setPracticeAndPrescriber = async (prescriberV?: IUser) => {
    setLoading(true);
    try {
      await userModel.setPracticeAndPrescriber({
        practice: userModel.data!.currentPractice!,
        prescriber: prescriberV ?? userModel.data!.user,
      });
      await settingsUserModel.setUserSettings(userModel.data?.currentPrescriber.id);
      await currentPrescriber.switchPracticeUser(userModel.data!.currentPractice!, prescriberV);
      await userModel.refreshUser();
      await currentPrescriber.setDefault(userModel.data?.currentPractice?.prescribers);
      alert();
    } catch {}
    setLoading(false);
  };

  const filterPrescribers = () => {
    if (search.length < 3) {
      return currentPrescriber.prescribers;
    }
    return currentPrescriber.prescribers.filter((prescriber) => {
      return prescriber.firstName?.toLowerCase().includes(search) || prescriber.lastName?.toLowerCase().includes(search);
    });
  };

  const checked = (user: Partial<IUser>) => {
    const check = currentPrescriber.selectUsers.find((value) => value === user);
    return !!check;
  };

  const addGrant = async (getUserID?: number) => {
    try {
      await currentPrescriber.saveAccessRequest({
        accessStatus: 0,
        prescriberID: getUserID,
        userID: userModel.data?.user.id,
      });
    } catch {}
  };

  const addAccessRequest = async (userId?: number, prescriberId?: number) => {
    try {
      await currentPrescriber.addAccessRequest(userId, prescriberId);
    } catch {}
  };
  const grantChecked = async (type) => {
    try {
      await currentPrescriber.addChecked(type, userModel.data?.user.id);
    } catch {}
  };
  const grantClose = () => {
    currentPrescriber.nullify();
  };
  /**
   * Sets the default prescriber
   * @param prescriber - Prescriber entity
   */
  //
  /**
   * Removes the prescriber default. The use case for this is so that
   * the user can stay  on the current user if they belong to a practice
   * that the user is changing to. If a default is selected that will take
   * president. If there is no default and the currentPrescriber doesnt belong
   * to the new practice then the current user is selected.
   * @param prescriber - Prescriber entity
   */
  const prescriberDefault = async (prescriberID?: string) => {
    try {
      await settingsUserModel.saveSetting(90, prescriberID);
      await settingsUserModel.setUserSettings(userModel.data?.currentPrescriber.id);
      await userModel.fetch();
      await currentPrescriber.setDefault(userModel.data?.currentPractice?.prescribers);
    } catch {}
  };

  // Possibly confused id (example angular)
  // also change in function
  // currentPrescriber.addChecked()
  /**
   * Adds a new request for prescribe using access. Places the access
   * in an active APPROVED status
   */
  /*
  const addGrant = async (getUserID?: number) => {
    try {
      await 
        currentPrescriber.saveAccessRequest({
          accessStatus: 0,
          prescriberID: userModel.data?.user.id,
          userID: getUserID,
        });
    } catch {}
  };
  */

  /**
   * Adds a new request for prescribe using access. This is a request that will
   * require the physician to approve
   */

  const requestList = () => {
    if (currentPrescriber.showUsers.length) {
      return (
        <ul className="divide-y divide-gray-200 max-h-96">
          {currentPrescriber.showUsers.map((user) => (
            <li className="hover:bg-gray-200">
              <label
                onChange={() => {
                  currentPrescriber.selectUser(user);
                }}
                className="flex items-center h-full w-full cursor-pointer px-1 py-2"
              >
                <input checked={checked(user)} className="form-checkbox" type="checkbox" />
                <div className="form-control-label_label w-full flex items-center justify-between">
                  <div>
                    <div>{`${user.lastName} ${user.firstName}`}</div>
                    <div>{user.userType}</div>
                    <div>{`${intl.formatMessage({ id: 'prescriber.measures.npi' })} ${user.npi}`}</div>
                  </div>
                  <Tooltip content={intl.formatMessage({ id: 'measures.addUser' })}>
                    <Button
                      onClick={() => {
                        addAccessRequest(userModel.data?.user.id, user.id);
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <PlusCircleIcon stroke="red" className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block text-red-500">{intl.formatMessage({ id: 'measures.add' })}</span>
                    </Button>
                  </Tooltip>
                </div>
              </label>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const grantList = () => {
    if (currentPrescriber.showUsers.length) {
      return (
        <ul className="divide-y divide-gray-200 max-h-96">
          {currentPrescriber.showUsers.map((user) => (
            <li className="hover:bg-gray-200">
              <label
                onChange={() => {
                  currentPrescriber.selectUser(user);
                }}
                className="flex items-center h-full w-full cursor-pointer px-1 py-2"
              >
                <input checked={checked(user)} className="form-checkbox" type="checkbox" />
                <div className="form-control-label_label w-full flex items-center justify-between">
                  <div>
                    <div>{`${user.lastName} ${user.firstName}`}</div>
                    <div>{user.userType}</div>
                    <div>{user.email}</div>
                    <div>{`${intl.formatMessage({ id: 'prescriber.measures.npi' })} ${user.npi}`}</div>
                  </div>
                  <Tooltip content={intl.formatMessage({ id: 'measures.addUser' })}>
                    <Button
                      onClick={() => {
                        addGrant(user.id);
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <PlusCircleIcon stroke="red" className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block text-red-500">{intl.formatMessage({ id: 'measures.add' })}</span>
                    </Button>
                  </Tooltip>
                </div>
              </label>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const header = (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white">
        {intl.formatMessage({ id: 'measures.prescriber' })}
      </Modal.Title>
      <div>
        <Tooltip content={intl.formatMessage({ id: 'prescriber.measures.prescribingAccessPhysician' })}>
          <PopupList
            title={`${intl.formatMessage({ id: 'measures.user' })}(${currentPrescriber.showUsers.length})`}
            searchBtns
            renderList={grantList}
            getList={grantAccess}
            type="grantUsers"
            addChecked={grantChecked}
            onClose={grantClose}
          >
            <UserAddIcon className="w-6 h-6 text-current" />
            <span className="text-green-200 text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'prescriber.measures.grant' })}</span>
          </PopupList>
        </Tooltip>

        <Tooltip content={intl.formatMessage({ id: 'prescriber.measures.reqPrescribingAccessPhysician' })}>
          <PopupList
            title={`${intl.formatMessage({ id: 'measures.user' })}(${currentPrescriber.showUsers.length})`}
            renderList={requestList}
            getList={requestAccess}
            type="requestUsers"
            addChecked={grantChecked}
            onClose={grantClose}
          >
            <UsersIcon className="w-6 h-6 text-current" />
            <span className="text-green-200 text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'prescriber.measures.request' })}</span>
          </PopupList>
        </Tooltip>

        <Button onClick={handleClose} variant="flat" shape="smooth" color="white" size={breakpoints.lg ? 'md' : 'xs'}>
          <XIcon className="w-6 h-6 text-current" />
        </Button>
      </div>
    </Modal.Header>
  );

  const body = (
    <div>
      <div className="flex items-end">
        <div className="form-control">
          <label className="form-label" htmlFor="searchPrescriber">
            {intl.formatMessage({ id: 'prescriber.measures.searchPrescriber' })}
          </label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase().trim());
            }}
            className="form-input"
            id="searchPrescriber"
            type="text"
            aria-describedby="helper-text-id-1-a"
          />
        </div>
        <Tooltip content={intl.formatMessage({ id: 'prescriber.measures.searchPrescriber' })}>
          <Button className="!py-1 hover:!bg-transparent" variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
            <SearchIcon className="w-5 h-5" />
          </Button>
        </Tooltip>
      </div>
      <div className="py-4">
        <ul className="divide-y divide-gray-200">
          {filterPrescribers().map((prescriber) => (
            <li className="py-4 px-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center">
              <div className="flex items-center">
                {userModel.data?.currentPrescriber.id === prescriber.id ? <CheckCircleIcon fill="green" className="w-6 h-6 ml-2 mr-6" /> : <></>}
                <div>
                  <div>{`${prescriber.lastName}, ${prescriber.firstName}`}</div>
                  {prescriber.defaultDoctor ? <div>Prescriber Set as Default</div> : <></>}
                  {userModel.data?.currentPrescriber.id === prescriber.id ? (
                    <div className="text-red-500">{intl.formatMessage({ id: 'prescriber.measures.currentSelectedPrescriber' })}</div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {prescriber.PrescribeFor.accessStatus === 0 &&
                  !(userModel.data?.user.id === prescriber.id && userModel.data?.user.prescriber) &&
                  userModel.data?.currentPrescriber.id !== prescriber.id ? (
                    <Button
                      onClick={() => {
                        setPracticeAndPrescriber(prescriber);
                        handleClose();
                      }}
                      className="h-full"
                      variant="filled"
                      shape="smooth"
                      color="red"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <span className="text-md leading-5 xl:block">{intl.formatMessage({ id: 'measures.select' })}</span>
                    </Button>
                  ) : (
                    <></>
                  )}

                  {prescriber.PrescribeFor.accessStatus === 0 &&
                  !(userModel.data?.user.id === prescriber.id && userModel.data?.user.prescriber) &&
                  userModel.data?.currentPrescriber.id === prescriber.id ? (
                    <Button
                      onClick={() => {
                        setPracticeAndPrescriber();
                        handleClose();
                      }}
                      className="h-full"
                      variant="filled"
                      shape="smooth"
                      color="red"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <span className="text-md leading-5 xl:block">{intl.formatMessage({ id: 'prescriber.measures.deSelect' })}</span>
                    </Button>
                  ) : (
                    <></>
                  )}

                  {!ComponentModel.isHidden('default-prescriber-select') && prescriber.PrescribeFor.accessStatus === 0 && !prescriber.defaultDoctor ? (
                    <Button
                      onClick={() => {
                        prescriberDefault(prescriber.id?.toString());
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <PlusCircleIcon className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block">Make Default Provider</span>
                    </Button>
                  ) : (
                    <></>
                  )}
                  {!ComponentModel.isHidden('default-prescriber-select') && prescriber.PrescribeFor.accessStatus === 0 && prescriber.defaultDoctor ? (
                    <Button
                      onClick={() => {
                        prescriberDefault();
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <PlusCircleIcon stroke="red" className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block text-red-500">{intl.formatMessage({ id: 'prescriber.measures.removePrescriber' })}</span>
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {prescriber.PrescribeFor.accessStatus === 1 ? (
                    <Tooltip content={intl.formatMessage({ id: 'prescriber.measures.deleteAccessReq' })}>
                      <Button
                        onClick={() => {
                          deleteRequest(prescriber.id);
                        }}
                        className="h-full"
                        variant="flat"
                        shape="smooth"
                        color="gray"
                        size={breakpoints.lg ? 'md' : 'xs'}
                      >
                        <TrashIcon className="w-5 h-5" />
                        <span className="text-md leading-5 xl:block">{intl.formatMessage({ id: 'prescriber.measures.AwaitApprovalPrescriber' })}</span>
                      </Button>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => {
          handleOpen();
          getHiddenComponents();
        }}
        className="relative h-full justify-center xl:flex xl:flex-col xl:!py-0 xl:whitespace-nowrap xl:justify-start"
        variant="flat"
        shape="smooth"
        color="white"
        disabled={loading}
        size={breakpoints.lg ? 'md' : 'xs'}
      >
        <span className="-top-1 left-4 text-green-200 text-xs leading-5 hidden xl:block">
          {intl.formatMessage({ id: 'prescriber.measures.currentPrescriber' })}
        </span>
        <div className="flex">
          {loading && <Spinner.Loader color="blue" className="h-4 w-4 md:mr-2" size="md" />}
          {!loading && <UserIcon className="w-4 h-4 text-current md:mr-2" />}
          <span className="hidden xl:inline">{`${userModel.data?.currentPrescriber.firstName} ${userModel.data?.currentPrescriber.lastName}`}</span>
        </div>
      </Button>

      <Modal open={open}>
        {header}
        <Modal.Body>{body}</Modal.Body>
      </Modal>
    </>
  );
});

Prescriber.displayName = 'Prescriber';
export default Prescriber;
