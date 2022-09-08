import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Button from 'shared/ui/button';
import { TrashIcon, XIcon, ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Modal from 'shared/ui/modal';
import { useForm } from 'react-hook-form';
import Tooltip from 'shared/ui/tooltip';
import { useNotifier } from 'react-headless-notifier';
import Alert from 'shared/ui/alert';

import { IUserInvite } from 'shared/api/invite';
import { IPractice } from 'shared/api/practice';

import Input from './input';
import PopupList from './popup.list';
import { addUser, userModel } from '../../model';

interface IInvite {
  close: () => void;
  title: string;
  prescribeTitle: string;
  addTitle: string;
  prescriber: boolean;
  subtitlePrescribe: (firstName: string, lastName: string) => string;
  attentionPrescribe: (firstName: string, lastName: string) => string;
}

const Invite: FC<IInvite> = observer(({ addTitle, prescribeTitle, title, subtitlePrescribe, attentionPrescribe, ...props }) => {
  const breakpoints = useBreakpoints();
  const form = useForm();
  const intl = useIntl();

  const { notify } = useNotifier();

  const alert = (type: string) => {
    notify(
      <Alert.Notification
        className="flex"
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        {`${type} ${intl.formatMessage({ id: 'invite.addPrescriber' })}`}
      </Alert.Notification>
    );
  };

  useEffect(() => {
    addUser.addPractices(userModel.data?.currentPractice);
  }, []);

  const checked = (input: IPractice | IUserInvite, type: string) => {
    let check;
    if (type === 'users') {
      check = addUser.selectUsersList.find((value) => value === input);
    }
    if (type === 'practice') {
      check = addUser.selectPracticesList.find((value) => value === input);
    }
    return !!check;
  };

  const fetchPractices = async () => {
    try {
      await addUser.fetchPractices();
    } catch {}
  };

  const checkEmail = async () => {
    try {
      await addUser.checkEmail(form.getValues('email'));
    } catch {}
  };

  const addInviteUser = async () => {
    try {
      await addUser.addInviteUser({
        businessUnitId: userModel.data!.currentPractice!.businessUnitId,
        email: form.getValues('email'),
        firstName: form.getValues('firstName'),
        inviteId: userModel.data!.currentOrganization!.inviteId!,
        isBusinessUnitAdmin: form.getValues('basicAdministrator'),
        lastName: form.getValues('lastName'),
        organizationId: userModel.data!.currentOrganization!.id!,
        prescriber: props.prescriber,
        siteAdministrator: form.getValues('fullAdministrator'),
        suffix: form.getValues('title'),
        inviteUserId: userModel.data?.currentPrescriber.inviteUserId,
      });
    } catch {}
  };

  const userSearchIncludeInvite = async () => {
    try {
      await addUser.userSearchIncludeInvite(
        props.prescriber,
        userModel.data?.currentOrganization?.inviteId,
        userModel.data?.currentOrganization?.id,
        userModel.data?.currentOrganization?.inviteOrganizationId,
        userModel.data?.user.id
      );
    } catch {}
  };

  if (!form.getValues('basicAdministrator')) {
    form.setValue('fullAdministrator', false);
  }
  form.watch(['basicAdministrator', 'firstName', 'lastName']);

  const practiceList = () => {
    if (addUser.practices.length) {
      return (
        <ul className="divide-y divide-gray-200 max-h-96">
          {addUser.filterPracticesList.map((practice) => (
            <li className="hover:bg-gray-200">
              <label
                onChange={() => {
                  addUser.selectPractices(practice);
                }}
                className="flex items-center h-full w-full cursor-pointer px-1 py-2"
              >
                <input checked={checked(practice, 'practice')} className="form-checkbox" type="checkbox" />
                <div className="form-control-label_label w-full flex items-center justify-between">
                  <div>
                    <div>{`${practice.name} (${practice.prescribingName})`}</div>
                    <div>{practice.addressLine1}</div>
                    <div>{practice.addressLine2}</div>
                    <div>{`${practice.city}, ${practice.state} ${practice.zip}`}</div>
                    <div>{practice.phone}</div>
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const usersList = () => {
    if (addUser.users.length) {
      return (
        <ul className="divide-y divide-gray-200 max-h-96">
          {addUser.filterUsersList.map((user) => (
            <li className="hover:bg-gray-200">
              <label
                onChange={() => {
                  addUser.selectUsers(user);
                }}
                className="flex items-center h-full w-full cursor-pointer px-1 py-2"
              >
                <input checked={checked(user, 'users')} className="form-checkbox" type="checkbox" />
                <div className="form-control-label_label w-full flex items-center justify-between">
                  <div>
                    <div>{`${user.lastName}, ${user.firstName}`}</div>
                  </div>
                  <Tooltip content={intl.formatMessage({ id: 'measures.addUser' })}>
                    <Button
                      onClick={() => {
                        addUser.addtUsers(user);
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <PlusCircleIcon stroke="red" fill="none" className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block text-red-500">{intl.formatMessage({ id: 'invite.add' })}</span>
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

  const body = (
    <div>
      <div>
        <div className="bg-blue-300 px-6">
          <div>{intl.formatMessage({ id: 'measures.general' })}</div>
        </div>
        <div className="px-6 flex gap-2">
          <Input form={form} required id="firstName" label={intl.formatMessage({ id: 'invite.firstName' })} maxLength={35} />

          <Input form={form} required id="lastName" label={intl.formatMessage({ id: 'invite.lastName' })} maxLength={35} />

          <Input form={form} id="title" label={intl.formatMessage({ id: 'measures.title' })} maxLength={10} />
        </div>
      </div>
      <div>
        <div className="bg-blue-300 px-6 flex">
          <div className="h-full w-2/5">{intl.formatMessage({ id: 'invite.contact' })}</div>
          <div className="h-full w-3/5">{intl.formatMessage({ id: 'invite.admin' })}</div>
        </div>
        <div className="px-6 flex gap-2">
          <Input
            error={addUser.mailError ? 'Email is already taken' : ''}
            onBlur={checkEmail}
            form={form}
            required
            id="email"
            label={intl.formatMessage({ id: 'invite.loginEmail' })}
          />

          <div className="w-3/5 pl-2">
            <div>
              <label className="form-control-label __end">
                <input className="form-checkbox" type="checkbox" {...form.register('basicAdministrator')} aria-describedby="helper-text-id-1-b" />
                <span className="form-control-label_label text-lg">{intl.formatMessage({ id: 'invite.basicAdmin' })}</span>
              </label>

              <span className="form-helper-text text-gray-300" id="helper-text-id-1-b">
                {intl.formatMessage({ id: 'invite.check' })}
              </span>
            </div>
            {form.getValues('basicAdministrator') ? (
              <div>
                <label className="form-control-label __end">
                  <input className="form-checkbox" type="checkbox" {...form.register('fullAdministrator')} aria-describedby="helper-text-id-1-b" />
                  <span className="form-control-label_label text-lg">{intl.formatMessage({ id: 'invite.fullAdmin' })}</span>
                </label>
                <span className="form-helper-text text-gray-300" id="helper-text-id-1-b">
                  {intl.formatMessage({ id: 'invite.checkAdd' })}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div>
        <div className="bg-blue-300 px-6 flex items-center justify-between">
          <div>{intl.formatMessage({ id: 'invite.associatedPractices' })}</div>

          <div className="flex">
            <Tooltip placement="bottom" content={intl.formatMessage({ id: 'invite.removeAll' })}>
              <Button
                onClick={() => {
                  addUser.removePractices();
                }}
                variant="flat"
                shape="smooth"
                color="gray"
                className="!hover:bg-none"
                size={breakpoints.lg ? 'md' : 'xs'}
              >
                <TrashIcon className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
              </Button>
            </Tooltip>

            <PopupList
              addList={() => {
                addUser.addPractices();
                alert('Practice');
              }}
              select={addUser.selectPracticesList.length}
              type="practice"
              placeholder={intl.formatMessage({ id: 'invite.searchPractice' })}
              getList={fetchPractices}
              title={`Practice(${addUser.filterPracticesList.length})`}
              renderList={practiceList}
            >
              <PlusCircleIcon className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
              <span className="hidden lg:inline">{intl.formatMessage({ id: 'invite.addPractice' })}</span>
            </PopupList>
          </div>
        </div>
        {addUser.addPracticesList.length ? (
          <ul className="divide-y divide-gray-200">
            {addUser.addPracticesList.map((practice) => (
              <li className="flex justify-between py-4 sm:px-6">
                <div>{practice.name}</div>
                <Button
                  onClick={() => {
                    addUser.removePractices(practice);
                  }}
                  className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                  variant="flat"
                  shape="smooth"
                  color="gray"
                  size={breakpoints.lg ? 'md' : 'xs'}
                >
                  <TrashIcon stroke="gray" className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
                  <span className="hidden lg:inline">{intl.formatMessage({ id: 'invite.remove' })}</span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-300 text-xl px-6">{intl.formatMessage({ id: 'invite.userAssociatedPractices' })}</div>
        )}
      </div>
      {form.getValues('firstName') && form.getValues('lastName') ? (
        <div>
          <div className="bg-blue-300 px-6 flex items-center justify-between">
            <div>{prescribeTitle}</div>
            <div className="flex">
              <Tooltip placement="bottom" content={intl.formatMessage({ id: 'invite.removeAll' })}>
                <Button
                  onClick={() => {
                    addUser.removeUsers();
                  }}
                  variant="flat"
                  shape="smooth"
                  color="gray"
                  className="!hover:bg-none"
                  size={breakpoints.lg ? 'md' : 'xs'}
                >
                  <TrashIcon className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
                </Button>
              </Tooltip>

              <PopupList
                addList={() => {
                  addUser.addtUsers();
                  alert('User');
                }}
                select={addUser.selectUsersList.length}
                type="users"
                placeholder={intl.formatMessage({ id: 'invite.userAssociatedPractices' })}
                searchBtns={!props.prescriber}
                getList={userSearchIncludeInvite}
                title={`${intl.formatMessage({ id: 'invite.practice' })}(${addUser.filterUsersList.length})`}
                renderList={usersList}
              >
                <PlusCircleIcon className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
                <span className="hidden lg:inline">{addTitle}</span>
              </PopupList>
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            <li className="flex justify-between p-4">{subtitlePrescribe(form.getValues('firstName'), form.getValues('lastName'))}</li>
            {addUser.addtUsersList.length ? (
              addUser.addtUsersList.map((user) => (
                <li className="flex justify-between py-4 sm:px-6">
                  <div>{`${user.lastName} ${user.firstName}`}</div>
                  <Button
                    onClick={() => {
                      addUser.removeUsers(user);
                    }}
                    className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                    variant="flat"
                    shape="smooth"
                    color="gray"
                    size={breakpoints.lg ? 'md' : 'xs'}
                  >
                    <TrashIcon stroke="gray" className="w-4 h-4 !rounded !text-white !bg-none lg:mr-2" />
                    <span className="hidden lg:inline">{intl.formatMessage({ id: 'invite.remove' })}</span>
                  </Button>
                </li>
              ))
            ) : (
              <div className="text-gray-300 text-xl px-6">{attentionPrescribe(form.getValues('firstName'), form.getValues('lastName'))}</div>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );

  const footer = (
    <div className="px-6 flex items-center justify-between py-2">
      <Button
        onClick={() => {
          addUser.removeUsers();
          addUser.removePractices();
          props.close();
        }}
        className="w-full sm:w-auto"
        variant="flat"
        shape="smooth"
        color="gray"
        size={breakpoints.lg ? 'md' : 'xs'}
      >
        <XIcon stroke="gray" className="w-8 h-8 !rounded !text-white !bg-none" />
        <span className="hidden lg:inline">{intl.formatMessage({ id: 'invite.practice' })}</span>
      </Button>

      <Button
        onClick={() => {
          addInviteUser();
          props.close();
          addUser.removeUsers();
          addUser.removePractices();
        }}
        className="w-full sm:w-auto"
        variant="filled"
        shape="smooth"
        color="blue"
        type="submit"
        size={breakpoints.lg ? 'md' : 'xs'}
      >
        <ChevronRightIcon className="w-8 h-8 !rounded !text-white !bg-none" />
        <span className="hidden lg:inline">{intl.formatMessage({ id: 'invite.sendInvite' })}</span>
      </Button>
    </div>
  );

  return (
    <>
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="sm:!p-0 max-h-96 overflow-y-auto">{body}</Modal.Body>
      {footer}
    </>
  );
});

Invite.displayName = 'Invite';
export default Invite;
