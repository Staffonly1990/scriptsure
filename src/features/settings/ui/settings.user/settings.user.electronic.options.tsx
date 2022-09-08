import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { ENamesSetting } from 'shared/api/settings';
import { getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import SettingsForm from '../settings.form/settings.form';
import settingModel from '../../model/settings.model';

/**
 * @view SettingsUserElectronicOptions */

const SettingsUserElectronicOptions: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, settingModel.currentSection)?.filter(
      (setting) => setting.name !== 'Services'
    );
  }, [settingsUserModel.settingsList]);

  return (
    <SettingsForm
      settings={[
        {
          title: intl.formatMessage({ id: 'settings.electronicOptions' }),

          settings: settingsByCurrentSection,
        },
      ]}
    />
  );
});
SettingsUserElectronicOptions.displayName = 'SettingsUserElectronicOptions';

export default SettingsUserElectronicOptions;
