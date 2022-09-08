import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import { TrashIcon } from '@heroicons/react/solid';
import { PlusCircleIcon, UserIcon } from '@heroicons/react/outline';
import { editProfile, userModel } from '../../model';

import Button from 'shared/ui/button';
import PopupList from './popup.list';
import Tooltip from 'shared/ui/tooltip';
import { IPrescribeFor } from 'shared/api/user';

const PrescribeFor: FC = observer(() => {
  const breakpoints = useBreakpoints();

  const getUsers = async () => {
    try {
      await editProfile.getUsers('prescribeFors', userModel.data?.user.id, userModel.data?.currentOrganization?.id);
    } catch {}
  };

  const checked = (prescriber: IPrescribeFor) => {
    const check = editProfile.prescribeForsSelect.find((value) => value === prescriber);
    return !!check;
  };

  const list = editProfile.prescribeFors.length && (
    <div className="px-6 py-3">
      <ul className="divide-y divide-gray-200">
        {editProfile.prescribeFors.map((prescriber) => (
          <li>
            <div className="flex items-center justify-between h-full w-full px-1 py-2">
              <div>
                <div>{`${prescriber.lastName}, ${prescriber.firstName} ${prescriber.degrees}`}</div>
                <div>{prescriber.userType}</div>
                <div>{`NPI: ${prescriber.npi}`}</div>
              </div>
              <div>
                {(prescriber?.accessStatus && prescriber?.accessStatus === 1) ||
                (prescriber?.PrescribeFor?.accessStatus && prescriber?.PrescribeFor?.accessStatus === 1) ? (
                  <Tooltip content="Delete Access Request">
                    <Button
                      // may be
                      // onClick={() => {deleteRequest(prescriber.id);}}
                      onClick={() => {
                        editProfile.removePrescribeFor(prescriber);
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <TrashIcon fill="#FF5722" className="w-6 h-6" />
                      <span className="text-md leading-5 xl:block">Awaiting Approval by Prescriber</span>
                    </Button>
                  </Tooltip>
                ) : null}

                <Button
                  onClick={() => {
                    editProfile.removePrescribeFor(prescriber);
                  }}
                  as="button"
                  className="uppercase"
                  color="gray"
                  variant="flat"
                  size={breakpoints.lg ? 'md' : 'xs'}
                >
                  <TrashIcon className="w-6 h-6 pr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const prescribeList = () => {
    if (editProfile.prescribeForsFilter) {
      return (
        <ul className="divide-y divide-gray-200 max-h-96">
          {editProfile.prescribeForsFilter.map((prescriber) => (
            <li
              onChange={() => {
                editProfile.selectPrescriberFors(prescriber);
              }}
              className="hover:bg-gray-200"
            >
              <label className="flex items-center h-full w-full cursor-pointer px-1 py-2">
                <input checked={checked(prescriber)} className="form-checkbox" type="checkbox" />
                <div className="form-control-label_label w-full flex items-center justify-between">
                  <div>
                    <div>{`${prescriber.lastName}, ${prescriber.firstName}`}</div>
                    <div>{prescriber.userType}</div>
                    <div>{`NPI: ${prescriber.npi}`}</div>
                  </div>
                  <Tooltip content="ADD USER">
                    <Button
                      onClick={() => {
                        editProfile.addPrescribeFor(prescriber);
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                      size={breakpoints.lg ? 'md' : 'xs'}
                    >
                      <PlusCircleIcon stroke="red" fill="none" className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block text-red-500">ADD</span>
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
    <div className="px-6 py-3">
      <div className="text-2xl">
        {`Users that are allowed to prescribe FOR 
        ${userModel.dataPlatform?.firstName} 
        ${userModel.dataPlatform?.lastName}`}
      </div>
    </div>
  );

  return (
    <div>
      <div className="title text-white bg-blue-500 px-6 py-4 flex justify-between items-center">
        <h5 className="title text-white">Prescribe Using</h5>
        <div>
          <PopupList
            addList={() => {
              editProfile.addPrescribeFor();
            }}
            getList={getUsers}
            searchBtns
            select={editProfile.prescribeForsSelect.length ?? 0}
            type="prescribeFors"
            placeholder="Search for last name..."
            title={`User(${editProfile.prescribeForsFilter?.length ?? 0})`}
            renderList={prescribeList}
          >
            <PlusCircleIcon className="w-6 h-6 !rounded !text-white !bg-none lg:mr-2" />
            <span className="hidden lg:inline">Add User</span>
          </PopupList>
          <Button
            onClick={() => {
              editProfile.removeAllPrescribeFors();
            }}
            variant="flat"
            shape="smooth"
            color="white"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <TrashIcon className="w-6 h-6 !rounded !text-white !bg-none lg:mr-2" />
            <span className="hidden lg:inline">Remove All</span>
          </Button>
        </div>
      </div>
      {body}
      {editProfile.prescribeFors.length ? (
        list
      ) : (
        <div className="px-6 py-3 flex items-center">
          <UserIcon color="gray" className="w-12 h-12 !rounded lg:mr-2" />
          <span className="hidden lg:inline text-2xl text-gray-400">
            {`No Users Assigned to Prescribe For ${userModel.dataPlatform?.firstName} ${userModel.dataPlatform?.lastName}`}
          </span>
        </div>
      )}
    </div>
  );
});

PrescribeFor.displayName = 'PrescribeFor';
export default PrescribeFor;
