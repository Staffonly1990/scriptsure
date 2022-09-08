import React, { FC, Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChatAltIcon, ChartSquareBarIcon, UserIcon, TemplateIcon, CreditCardIcon as OutlineCard, MenuAlt2Icon } from '@heroicons/react/outline';
import { CogIcon, PencilIcon, CreditCardIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { routes } from 'shared/config';
import { userModel, UserAvatar, AddUser, EditProfile, editProfile } from 'features/user';
import { patientModel } from 'features/patient';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Dropdown from 'shared/ui/dropdown';
import Button from 'shared/ui/button';
import ThemeSwitcher from 'shared/ui/dark.mode/dark.theme.switcher';
import { CurrentPractice } from 'features/practice';
import { CurrentPrescriber } from 'features/prescriber';
import { QueuePrescriptionPopper, prescriptionQueue } from 'features/prescription';
import { messageStore } from 'features/message';
import LangSwitcher from '../shared/ui/lang.switch/lang.switcher';

const Header: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const [openEditProfile, setEditProfile] = useState(false);
  const intl = useIntl();

  const actionEditProfile = async () => {
    try {
      await userModel.fetchPlatform();
      await editProfile.profileValues(userModel.dataPlatform);
      setEditProfile(true);
    } catch {}
  };

  useEffect(() => {
    if (userModel.data?.currentPrescriber.id && userModel.data?.currentPractice?.id) {
      messageStore.getMessagePendingCount(userModel.data?.currentPrescriber.id, userModel.data?.currentPractice?.id);
    }
  }, []);

  return (
    <header className="sticky z-sticky top-0 w-screen bg-primary shadow">
      <div className="flex flex-nowrap items-center justify-between w-full h-12">
        <div className="flex flex-nowrap">
          <div className="flex items-center h-12 space-x-1 px-1 bg-green-600 md:space-x-2 md:px-2 dark:bg-green-500">
            <CurrentPractice />

            <CurrentPrescriber />

            {patientModel.currentPatient && (
              <Button
                as={Link}
                className="relative h-full justify-center xl:flex xl:flex-col xl:!py-0 xl:whitespace-nowrap xl:justify-start"
                variant="flat"
                shape="smooth"
                color="white"
                size={breakpoints.lg ? 'md' : 'xs'}
                to={routes.chart.path(Number(patientModel.currentPatient?.chartId) || Number(patientModel.currentPatient?.patientId))}
              >
                <span className="-top-1 left-4 text-green-200 text-xs leading-5 hidden xl:block">{intl.formatMessage({ id: 'measures.patient' })}</span>
                <div className="flex">
                  <TemplateIcon className="w-4 h-4 text-current md:mr-2" />
                  <span className="hidden xl:inline">
                    {patientModel.currentPatient?.firstName} {patientModel.currentPatient?.lastName}
                  </span>
                </div>
              </Button>
            )}
          </div>

          <nav className="flex items-center space-x-1 px-1 md:space-x-2 md:px-2">
            <Button as={Link} to="/" variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
              <HomeIcon className="w-4 h-4 md:mr-2" />
              <span className="hidden 2xl:inline">{intl.formatMessage({ id: 'header.home' })}</span>
            </Button>
            <Button as={Link} to="/message" variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
              <ChatAltIcon className="w-4 h-4 md:mr-2" />
              <span className="hidden 2xl:inline">{intl.formatMessage({ id: 'header.messages' })}</span>
              {messageStore.pending > 0 && (
                <Button variant="filled" shape="circle" color="red" className="justify-center	 text-xs w-5 h-5">
                  {messageStore.pending}
                </Button>
              )}
            </Button>
            <Button as={Link} to="/report" variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
              <ChartSquareBarIcon className="w-4 h-4 md:mr-2 " />
              <span className="hidden 2xl:inline">{intl.formatMessage({ id: 'reports.measures.reports' })}</span>
            </Button>
            {/* 
            Кнопка Queue появляется при:
            - mainNavBar.notDevice() && mainNavBar.PrescriptionQueueService.messages.length>0
            - mainNavBar.notDevice() - проверка ширины экрана
            - messages добавляются при нажатии на "Queue ToF Provider For Approval" в карточке создания рецепта
            - отображение по всем пациентам этого врача 
            */}
            {prescriptionQueue.list.length > 0 && <QueuePrescriptionPopper />}
            {/* 
            условия для появления кнопки:
            mainNavBar.EpcsService.epcs.length>0 && mainNavBar.isAdministrator() === true 
            */}
            <Button as={Link} to="/#" variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
              <MenuAlt2Icon className="w-4 h-4 md:mr-2" stroke="red" />
              <span className="hidden 2xl:inline">{intl.formatMessage({ id: 'header.epcs' })}</span>
            </Button>
          </nav>
        </div>

        <div className="flex flex-nowrap items-center space-x-1 px-1 md:space-x-2 md:px-2">
          <Button variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
            <OutlineCard className="w-4 h-4 md:mr-2" stroke="red" />
          </Button>

          <AddUser />

          <Dropdown
            list={[
              <>
                <Dropdown.Item as={Link} to="/settings">
                  <CogIcon className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'header.settings' })}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => userModel.logout()}>
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'header.logout' })}
                </Dropdown.Item>
              </>,
              <>
                <Dropdown.Item disabled>
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'header.updateBilling' })}
                </Dropdown.Item>

                <Dropdown.Item onClick={actionEditProfile}>
                  <PencilIcon className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'header.editProfile' })}
                </Dropdown.Item>
              </>,
              <Dropdown.Item disabled>
                <CreditCardIcon className="w-4 h-4 mr-2" />
                {intl.formatMessage({ id: 'header.changeOptions' })}
              </Dropdown.Item>,
              <Dropdown.Item onClick={() => userModel?.lock()}>
                <LockClosedIcon className="w-4 h-4 mr-2" />
                {intl.formatMessage({ id: 'header.lockApp' })}
              </Dropdown.Item>,
            ]}
          >
            <Button variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
              <UserAvatar as={Fragment} />
            </Button>
          </Dropdown>

          <EditProfile open={openEditProfile} setOpen={setEditProfile} />
          <ThemeSwitcher />
          <LangSwitcher />
        </div>
      </div>
    </header>
  );
});
Header.displayName = 'Header';

export { Header };
