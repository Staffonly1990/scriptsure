import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import styles from './current.practice.module.css';
import { useBreakpoints } from 'shared/lib/media.breakpoints';

import Dropdown from 'shared/ui/dropdown';
import Button from 'shared/ui/button';
import { OfficeBuildingIcon, SearchIcon, HomeIcon, XIcon } from '@heroicons/react/outline';
import Tooltip from 'shared/ui/tooltip';
import { userModel } from 'features/user';
import { IPractice } from 'shared/api/practice';
import { currentPracticeStore } from '../../model';
import { useNotifier } from 'react-headless-notifier';
import Alert from 'shared/ui/alert';
import Spinner from 'shared/ui/spinner';
import settingsPracticeModel from 'features/settings/model/settings.practice.model';
import settingsUserModel from 'features/settings/model/settings.user.model';

const CurrentPractice: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const [search, setSearch] = useState(false);
  const [{ open }, updateArgs] = useState({ open: false });
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const handleOpen = () => {
    updateArgs({ open: true });
  };

  const handleClose = (value?: boolean) => {
    updateArgs({ open: value ?? false });
  };

  const { notify } = useNotifier();

  const alert = () => {
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        {intl.formatMessage({ id: 'practice.measures.practiceSelected' })}
      </Alert.Notification>
    );
  };

  const setPracticeAndPrescriber = async (practiceV: IPractice) => {
    setLoading(true);
    try {
      // Sets the session state for the main PRACTICE and USER
      await userModel.setPracticeAndPrescriber({
        practice: practiceV,
        prescriber: userModel.data!.currentPrescriber,
      });
      // Set the business unit settings based on the business unit
      // associated with the practice
      await settingsPracticeModel.setBusinessUnitSettings(practiceV.businessUnitId);
      // Sets the practice and the current default user. Additionally,
      // this calls the PLATFORM to refresh the practice settings AND
      // performs a registration check on the SPI number to determine the
      // current registration status
      const practiceUser = await currentPracticeStore.setPracticeUser(practiceV, userModel.data!);
      await userModel.setPracticeAndPrescriber({
        practice: practiceV,
        prescriber: practiceUser,
      });
      if (practiceUser.id) await settingsUserModel.setUserSettings(practiceUser.id);
      await currentPracticeStore.switchPracticeUser(practiceUser, practiceV);
      await userModel.refreshUser();
      alert();
    } catch {}
    setLoading(false);
  };

  const header = (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white">
        {intl.formatMessage({ id: 'practice.measures.selectPractice' })}
      </Modal.Title>
      <div>
        {search ? (
          <input
            value={currentPracticeStore.search}
            onChange={(e) => {
              currentPracticeStore.searchChange(e.target.value);
            }}
            placeholder={intl.formatMessage({ id: 'practice.measures.practiceSearch' })}
            className="outline-none bg-transparent border-b-2 border-gray-700 placeholder-gray-700"
            type="text"
          />
        ) : (
          <></>
        )}

        <Tooltip placement="bottom" content={intl.formatMessage({ id: 'practice.measures.practiceSearch' })}>
          <Button
            onClick={() => {
              setSearch(!search);
            }}
            color="gray"
            variant="flat"
            shape="circle"
          >
            <SearchIcon className="w-6 h-6" />
          </Button>
        </Tooltip>

        <Dropdown
          placement="bottom-start"
          list={currentPracticeStore.states.map((state) => (
            <div
              role="presentation"
              onKeyDown={() => {
                currentPracticeStore.stateСhoice(state);
              }}
              onClick={() => {
                currentPracticeStore.stateСhoice(state);
              }}
              className="hover:bg-gray-200 cursor-pointer px-3"
            >
              {state}
            </div>
          ))}
        >
          <Tooltip placement="bottom" content={intl.formatMessage({ id: 'practice.measures.selectLocation' })}>
            <Button color="gray" variant="flat" shape="circle">
              <HomeIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
        </Dropdown>

        <Button
          onClick={() => {
            handleClose(false);
          }}
          color="gray"
          variant="flat"
          shape="circle"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </div>
    </Modal.Header>
  );

  const body = (
    <div className={`${styles.body} overflow-hidden`}>
      <ul className="divide-y divide-gray-200">
        {currentPracticeStore.result ? (
          currentPracticeStore.result.map((practice) => (
            <li
              key={practice.id}
              role="presentation"
              onKeyDown={() => {
                setPracticeAndPrescriber(practice);
                handleClose(false);
              }}
              onClick={() => {
                setPracticeAndPrescriber(practice);
                handleClose(false);
              }}
              className="flex justify-between px-4 py-4 sm:px-6 hover:bg-gray-200 cursor-pointer transform"
            >
              <div>{`${practice.name} ${practice.state}`}</div>
              {practice.id === userModel.data?.currentPractice?.id ? (
                <div>{intl.formatMessage({ id: 'practice.measures.currentlySelected' })}</div>
              ) : (
                <Button>{intl.formatMessage({ id: 'measures.select' })}</Button>
              )}
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => {
          handleOpen();
          currentPracticeStore.getCurrentPractice(userModel?.data?.practices || []);
        }}
        className="relative h-full justify-center xl:flex xl:flex-col xl:!py-0 xl:whitespace-nowrap xl:justify-start"
        variant="flat"
        shape="smooth"
        color="white"
        disabled={loading}
        size={breakpoints.lg ? 'md' : 'xs'}
      >
        <span className="-top-1 left-4 text-green-200 text-xs leading-5 hidden xl:block">
          {intl.formatMessage({ id: 'practice.measures.currentPractice' })}
        </span>
        <div className="flex">
          {loading && <Spinner.Loader color="blue" className="h-4 w-4 md:mr-2" size="md" />}
          {!loading && <OfficeBuildingIcon className="w-4 h-4 text-current md:mr-2" />}
          <span className="hidden xl:inline">{userModel.data?.currentPractice?.name || intl.formatMessage({ id: 'practice.measures.practiceName' })}</span>
        </div>
      </Button>

      <Modal open={open} onClose={handleClose}>
        {header}
        <Modal.Body>{body}</Modal.Body>
      </Modal>
    </>
  );
});

CurrentPractice.displayName = 'CurrentPractice';
export default CurrentPractice;
