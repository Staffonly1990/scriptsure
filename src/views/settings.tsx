import React, { FC, useState, VFC } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Tooltip from 'shared/ui/tooltip';
import Dropdown from 'shared/ui/dropdown';
import {
  SettingsManageAddUser,
  SettingsModalView,
  SettingsPracticeLocation,
  SettingsPracticeNotifications,
  SettingsPracticeEpicsApproval,
  SettingsPracticeOpioid,
  SettingsPracticePmpControlled,
  SettingsPracticePendingPrescription,
  SettingsPracticeElectronicPrescription,
  SettingsPracticeAdvanced,
  SettingsSecurity,
  SettingsUserCheck,
  SettingsUserElectronicOptions,
  SettingsUserEpcsLogin,
  SettingsUserMiscellaneous,
  SettingsUserPrescriptionAlerts,
  SettingsUserPrint,
  SettingsUserProfile,
  SettingsBilling,
  SettingsMiscellaneous,
  SettingsManageUserList,
  SettingsTermsOfUse,
} from 'features/settings/ui';
import { MenuIcon } from '@heroicons/react/outline';
import { Link, Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import { useRouter } from 'shared/hooks';
import { routes } from 'shared/config';
import { map } from 'lodash';
import { ENamesSetting, ESettingMainId } from 'shared/api/settings';
import { PrivateRoute } from './route';
import { useIntl } from 'react-intl';
/**
 * @view Settings
 */

const SettingsView: FC = observer(() => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const [changedBlock, setChangedBlock] = useState('');
  const toggleBlock = (data) => {
    setChangedBlock(data);
  };
  const {
    match: { path },
  } = useRouter();
  const views: Array<{
    mainId: number;
    pathname: string;
    view: FC<RouteComponentProps<any>> | VFC<RouteComponentProps<any>>;
    text: string;
  }> = [
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticeLocation,
      text: 'Practice Locations',
      pathname: routes.setting.routes.locations.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticeNotifications,
      text: 'Notifications and Alerts',
      pathname: routes.setting.routes.notifications.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticeElectronicPrescription,
      text: 'Electronic Prescriptions',
      pathname: routes.setting.routes.prescriptions.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticeEpicsApproval,
      text: 'EPCS Approval',
      pathname: routes.setting.routes.prescriptions.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticeAdvanced,
      text: 'Advanced Practice Settings',
      pathname: routes.setting.routes.advancedSetting.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticeOpioid,
      text: 'Opioid Limits',
      pathname: routes.setting.routes.opioid.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticePmpControlled,
      text: 'PMP Controlled',
      pathname: routes.setting.routes.pmpControlled.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.PracticeSetting],
      view: SettingsPracticePendingPrescription,
      text: 'Pending Prescription Alerts',
      pathname: routes.setting.routes.practicePendingAlerts.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserProfile,
      text: 'User Profile',
      pathname: routes.setting.routes.userProfile.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserElectronicOptions,
      text: 'Electronic Options',
      pathname: routes.setting.routes.electronicOption.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserEpcsLogin,
      text: 'EPCS Login',
      pathname: routes.setting.routes.epicsLogin.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserCheck,
      text: 'Checks and Alerts',
      pathname: routes.setting.routes.checks.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserPrint,
      text: 'Print Settings',
      pathname: routes.setting.routes.print.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsTermsOfUse,
      text: intl.formatMessage({ id: 'settings.termsOfUse' }),
      pathname: routes.setting.routes.termOsUse.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserMiscellaneous,
      text: 'Miscellaneous',
      pathname: routes.setting.routes.miscellaneousUser.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.UserSetting],
      view: SettingsUserPrescriptionAlerts,
      text: 'Pending Prescription Alerts',
      pathname: routes.setting.routes.userPendingAlerts.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.ManageUsers],
      view: SettingsManageUserList,
      text: 'Manage User List',
      pathname: routes.setting.routes.userList.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.ManageUsers],
      view: SettingsManageAddUser,
      text: 'Add User',
      pathname: routes.setting.routes.addUser.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.Security],
      view: SettingsSecurity,
      text: 'Security for Users/Roles',
      pathname: routes.setting.routes.security.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.Billing],
      view: SettingsBilling,
      text: 'Billing',
      pathname: routes.setting.routes.billing.path(),
    },
    {
      mainId: ESettingMainId[ENamesSetting.Miscellaneous],
      view: SettingsMiscellaneous,
      text: 'Restore Setting Defaults',
      pathname: routes.setting.routes.miscellaneous.path(),
    },
  ];

  return (
    <div className="mt-4 mx-2">
      <div className="flex xs:justify-between items-center bg-blue-500 text-2xl dark:bg-blue-400">
        <div className="lg:invisible">
          <Dropdown list={[<SettingsModalView toggleBlock={toggleBlock} views={views} />]} placement="bottom-start">
            <Tooltip content="Settings Menu">
              <Button shape="circle" variant="flat" color="black" className="m-2">
                <MenuIcon className="w-8 h-8" />
              </Button>
            </Tooltip>
          </Dropdown>
        </div>
        <span className="text-white m-2">{changedBlock}</span>
        {/* <SettingsTimer /> */}
      </div>
      <div className="m-5 mt-0 flex justify-start">
        <div className="lg:w-1/3 lg:h-full">{breakpoints.lg && <SettingsModalView toggleBlock={toggleBlock} views={views} />}</div>
        <Switch>
          {map(views, ({ pathname, view: View }, index) => (
            <PrivateRoute key={`${index.toString(36)}`} path={`${path}${pathname}`} component={View} />
          ))}
          <Redirect
            to={{
              pathname: `${routes.setting.path()}`,
              state: { preventLastLocation: true },
            }}
          />
        </Switch>
      </div>
      <Button className="uppercase xs:sticky left-5 bottom-1" shape="smooth" as={Link} to="/">
        {intl.formatMessage({ id: 'close' })}
      </Button>
    </div>
  );
});

SettingsView.displayName = 'SettingsView';

export default SettingsView;
