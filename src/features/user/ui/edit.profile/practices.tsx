import React, { FC, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/solid';
import { UserIcon } from '@heroicons/react/outline';
import { editProfile, userModel } from '../../model';

import Button from 'shared/ui/button';
import Table, { Column } from 'shared/ui/table';
import PopupList from './popup.list';
import { IPractice } from 'shared/api/practice';

const Practices: FC = observer(() => {
  const breakpoints = useBreakpoints();

  const getPracticeList = async () => {
    try {
      await editProfile.getPracticeList(userModel.data?.currentOrganization?.id);
    } catch {}
  };

  const checked = (practice: IPractice) => {
    const check = editProfile.practicesSelect.find((value) => value === practice);
    return !!check;
  };

  const practiceList = () => {
    if (editProfile.practicesFilter) {
      return (
        <>
          <div className="text-xl font-bold">Check off the practices below that this user is associated with, then click Add Checked button.</div>
          <ul className="divide-y divide-gray-200 max-h-96">
            {editProfile.practicesFilter.map((practice) => (
              <li
                onChange={() => {
                  editProfile.selectPractice(practice);
                }}
                className="hover:bg-gray-200"
              >
                <label className="flex items-center h-full w-full cursor-pointer px-1 py-2">
                  <input checked={checked(practice)} className="form-checkbox" type="checkbox" />
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
        </>
      );
    }
    return null;
  };

  const actions = {
    Cell: ({ row: { original: practice } }) => {
      return (
        <Button
          onClick={() => {
            editProfile.removePractice(practice);
          }}
          as="button"
          className="uppercase"
          color="blue"
          size={breakpoints.lg ? 'md' : 'xs'}
        >
          <TrashIcon className="w-6 h-6 pr-1" />
          Remove
        </Button>
      );
    },
  };

  const columns = useMemo<Array<Column>>(
    () => [
      {
        Header: 'printed name',
        id: 'name',
        accessor: 'name',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
      },
      {
        Header: 'address line 1',
        id: 'addressLine1',
        accessor: 'addressLine1',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: 'address line 2',
        id: 'addressLine2',
        accessor: 'addressLine2',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: 'city',
        id: 'city',
        accessor: 'city',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: 'state',
        id: 'state',
        accessor: 'state',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: 'phone',
        id: 'phone',
        accessor: 'phone',
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        id: 'actions',
        disableSortBy: true,
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
        ...actions,
      },
    ],
    [editProfile.practices]
  );

  const body = (
    <div className="px-6 py-3">
      <div className="text-2xl">User Practices</div>
      <div>Add the list of practices that the user has privileges to access. Note: User must be associated with at least one practice.</div>
    </div>
  );

  const table = (
    <div className="px-6 py-3">
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
        data={editProfile.practices}
        pagination={{ pageIndex: 0, pageSize: 15 }}
        sortable
      />
    </div>
  );

  return (
    <div>
      <div className="title text-white bg-blue-500 px-6 py-4 flex justify-between items-center">
        <h5 className="title text-white">Practices</h5>
        <div>
          <PopupList
            addList={() => {
              editProfile.addPractices(userModel.dataPlatform?.UserSpi);
            }}
            getList={getPracticeList}
            select={editProfile.practicesSelect.length}
            type="practice"
            placeholder="Search for practice..."
            title={`Practice(${editProfile.practicesFilter?.length ?? 0})`}
            renderList={practiceList}
          >
            <PlusCircleIcon className="w-6 h-6 !rounded !text-white !bg-none lg:mr-2" />
            <span className="hidden lg:inline">Add Practice</span>
          </PopupList>
          {/*
          vm.removeAllPrescribeUsing()
          YES/NO
          */}
          <Button
            onClick={() => {
              editProfile.removeAllPractices();
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
      {editProfile.practices.length ? (
        table
      ) : (
        <div className="px-6 py-3 flex items-center">
          <UserIcon color="gray" className="w-12 h-12 !rounded lg:mr-2" />
          <span className="hidden lg:inline text-2xl text-gray-400">User Must Be Associated to Practices</span>
        </div>
      )}
    </div>
  );
});

Practices.displayName = 'Practices';
export default Practices;
