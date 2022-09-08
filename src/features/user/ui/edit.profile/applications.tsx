import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/solid';
import { userModel, editProfile } from '../../model';

import Button from 'shared/ui/button';
import Popper from 'shared/ui/popper';
import { IApplication } from 'shared/api/user';

const Applications: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const [open, setOpen] = useState(false);

  const checked = (application: IApplication) => {
    const check = editProfile.applications.find((value) => value === application);
    return !!check;
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const list = editProfile.applications.length && (
    <div className="px-6 py-3">
      <ul className="divide-y divide-gray-200">
        {editProfile.applications.map((application) => (
          <li className="p-3">
            <div className="flex items-center justify-between h-full w-full px-1 py-2">
              <div>{application.name}</div>
              <Button
                onClick={() => {
                  editProfile.removeApplications(application);
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
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <div className="title text-white bg-blue-500 px-6 py-4 flex justify-between items-center">
        <h5 className="title text-white">Applications</h5>
        <div>
          {userModel.dataPlatform?.Applications && (
            <Popper
              className="overflow-hidden max-h-80"
              open={open}
              onOpen={handleOpen}
              onClose={handleClose}
              content={
                <Popper.Listbox className="overflow-y-auto">
                  {userModel.dataPlatform?.Applications.map((application) => (
                    <Popper.ListboxItem as="label">
                      <input
                        onChange={() => {
                          editProfile.addApplications(application);
                        }}
                        checked={checked(application)}
                        className="form-checkbox m-0 mr-4"
                        type="checkbox"
                      />
                      {application.name}
                    </Popper.ListboxItem>
                  ))}
                </Popper.Listbox>
              }
            >
              <Button variant="flat" shape="smooth" color="white" size={breakpoints.lg ? 'md' : 'xs'}>
                <PlusCircleIcon className="w-6 h-6 !rounded !text-white !bg-none lg:mr-2" />
                <span className="hidden lg:inline">Add Application</span>
              </Button>
            </Popper>
          )}
        </div>
      </div>
      {editProfile.applications.length ? list : null}
    </div>
  );
});

Applications.displayName = 'Applications';
export default Applications;
