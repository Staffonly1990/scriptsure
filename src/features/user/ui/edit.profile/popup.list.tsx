import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Modal from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { UserIcon as OutlineUserIcon, MenuAlt3Icon, CheckIcon, XIcon, ViewGridAddIcon } from '@heroicons/react/outline';
import { UserIcon as SolidUserIcon, ViewGridIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { editProfile } from '../../model';

interface IPopupList {
  addList: () => void;
  getList: () => void;
  renderList: () => JSX.Element | null;
  searchBtns?: boolean;
  title: string;
  placeholder: string;
  type: 'practice' | 'prescribers' | 'prescribeFors';
  select: number;
}

const PopupList: FC<IPopupList> = observer(({ placeholder, select, children, searchBtns, getList, renderList, addList, title, type }) => {
  const [open, updateArgs] = useState(false);
  const breakpoints = useBreakpoints();

  const handleOpen = () => {
    updateArgs(true);
  };

  const handleClose = () => {
    updateArgs(false);
  };

  const header = (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white">
        {title}
      </Modal.Title>
    </Modal.Header>
  );

  const body = (
    <div>
      <div className="flex items-center w-full">
        <div className="form-control w-full">
          <input
            onChange={(e) => {
              editProfile.inputSearch(e.target.value, type);
            }}
            placeholder={placeholder}
            className="form-input"
            type="text"
            aria-describedby="helper-text-id-1-a"
          />
        </div>
        <Button onClick={getList} className="mx-1" variant="filled" shape="smooth" size={breakpoints.lg ? 'md' : 'xs'}>
          <MenuAlt3Icon className="w-6 h-6 text-current" />
          <span className="text-md leading-5 hidden xl:block">Clear</span>
        </Button>
      </div>
      {searchBtns ? (
        <div className="flex items-center w-full">
          <Button className="mx-1" variant="filled" shape="smooth" size={breakpoints.lg ? 'md' : 'xs'}>
            <SolidUserIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">Prescriber Only</span>
          </Button>
          <Button className="mx-1" variant="filled" shape="smooth" size={breakpoints.lg ? 'md' : 'xs'}>
            <OutlineUserIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">Supporting Only</span>
          </Button>
          <Button className="mx-1" variant="filled" shape="smooth" size={breakpoints.lg ? 'md' : 'xs'}>
            <ViewGridIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">Show All</span>
          </Button>
        </div>
      ) : (
        <></>
      )}
      <div className="overflow-auto pt-4">{renderList()}</div>

      <div className="flex items-center w-full justify-between pt-4">
        <div className="flex items-center">
          <Button
            onClick={() => {
              editProfile.checkAll(type);
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <CheckIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">Check All</span>
          </Button>

          <Button
            onClick={() => {
              editProfile.checkAll();
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <XIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">Uncheck All</span>
          </Button>
        </div>
        <div className="flex items-center">
          {select ? (
            <Button onClick={addList} className="mx-1" variant="filled" shape="smooth" size={breakpoints.lg ? 'md' : 'xs'}>
              <ViewGridAddIcon className="w-6 h-6 text-current" />
              <span className="text-md leading-5 hidden xl:block">{`ADD CHECKED (${select})`}</span>
            </Button>
          ) : null}
          <Button
            onClick={() => {
              handleClose();
              editProfile.nullify();
            }}
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <span className="text-md leading-5 hidden xl:block h-6">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => {
          getList();
          handleOpen();
        }}
        variant="flat"
        shape="smooth"
        color="white"
        size={breakpoints.lg ? 'md' : 'xs'}
      >
        {children}
      </Button>

      <Modal open={open}>
        {header}
        <Modal.Body>{body}</Modal.Body>
      </Modal>
    </>
  );
});

PopupList.displayName = 'PopupList';
export default PopupList;
