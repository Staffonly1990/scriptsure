import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { ENamesSetting } from 'shared/api/settings';
import { getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import SettingsForm from '../settings.form/settings.form';
import settingModel from '../../model/settings.model';

/**
 * @view SettingsUserCheck
 */
const SettingsUserCheck: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, settingModel.currentSection);
  }, [settingsUserModel.settingsList]);

  return (
    <SettingsForm
      settings={[
        {
          title: intl.formatMessage({ id: 'settings.checkAndAlerts' }),
          settings: settingsByCurrentSection,
        },
      ]}
    />
  );
});
SettingsUserCheck.displayName = 'SettingsUserCheck';

export default SettingsUserCheck;
