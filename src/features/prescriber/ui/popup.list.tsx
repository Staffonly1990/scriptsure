import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import styles from './prescriber.module.css';
import Modal from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { UserIcon as OutlineUserIcon, MenuAlt3Icon, CheckIcon, XIcon, ViewGridAddIcon } from '@heroicons/react/outline';
import { UserIcon as SolidUserIcon, ViewGridIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { flowResult } from 'mobx';
import { currentPrescriber } from '../model';
import { userModel } from 'features/user';

interface IPopupList {
  getList: () => void;
  renderList: () => JSX.Element | null;
  searchBtns?: boolean;
  title: string;
  type: 'grantUsers' | 'requestUsers';
  addChecked: (type?: string) => void;
  onClose: () => void;
}

const PopupList: FC<IPopupList> = observer(({ children, getList, renderList, searchBtns, title, type, addChecked, onClose }) => {
  const [open, updateArgs] = useState(false);
  const breakpoints = useBreakpoints();
  const intl = useIntl();

  const handleOpen = () => {
    updateArgs(true);
  };

  const handleClose = () => {
    updateArgs(false);
  };

  const userSearch = async (lastNameV: string) => {
    try {
      await currentPrescriber.userSearch({
        lastName: lastNameV,
        npiOnly: false,
      });
    } catch {}
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
              userSearch(e.target.value);
            }}
            placeholder={intl.formatMessage({ id: 'reports.measures.searchLastName' })}
            className="form-input"
            type="text"
            aria-describedby="helper-text-id-1-a"
          />
        </div>
        <Button onClick={getList} className="mx-1" variant="filled" shape="smooth" size={breakpoints.lg ? 'md' : 'xs'}>
          <MenuAlt3Icon className="w-6 h-6 text-current" />
          <span className="text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'reports.measures.clear' })}</span>
        </Button>
      </div>
      {searchBtns ? (
        <div className="flex items-center w-full">
          <Button
            onClick={() => {
              currentPrescriber.filter(1);
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <SolidUserIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'prescriber.measures.prescriberOnly' })}</span>
          </Button>
          <Button
            onClick={() => {
              currentPrescriber.filter(2);
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <OutlineUserIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'prescriber.measures.supportingOnly' })}</span>
          </Button>
          <Button
            onClick={() => {
              currentPrescriber.filter(0);
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <ViewGridIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'prescriber.measures.showAll' })}</span>
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
              currentPrescriber.checkAll('All');
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <CheckIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'measures.checkAll' })}</span>
          </Button>
          <Button
            onClick={() => {
              currentPrescriber.checkAll();
            }}
            className="mx-1"
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <XIcon className="w-6 h-6 text-current" />
            <span className="text-md leading-5 hidden xl:block">{intl.formatMessage({ id: 'measures.uncheckAll' })}</span>
          </Button>
        </div>
        <div className="flex items-center">
          {currentPrescriber.selectUsers.length > 0 ? (
            <Button
              onClick={() => {
                addChecked(type);
                currentPrescriber.addChecked(type, userModel.data?.user.id);
              }}
              className="mx-1"
              variant="filled"
              shape="smooth"
              size={breakpoints.lg ? 'md' : 'xs'}
            >
              <ViewGridAddIcon className="w-6 h-6 text-current" />
              <span className="text-md leading-5 hidden xl:block">
                {`${intl.formatMessage({ id: 'measures.addChecked' })} (${currentPrescriber.selectUsers.length})`}
              </span>
            </Button>
          ) : null}
          <Button
            onClick={() => {
              handleClose();
              onClose();
            }}
            variant="filled"
            shape="smooth"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <span className="text-md leading-5 hidden xl:block h-6">{intl.formatMessage({ id: 'measures.close' })}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => {
          currentPrescriber.nullify();
          handleOpen();
          getList();
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
