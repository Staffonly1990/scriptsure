import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import SettingsForm from '../settings.form/settings.form';
import settingModel from '../../model/settings.model';
import { ENamesSetting } from 'shared/api/settings';

/**
 * @view SettingsUserPrescriptionAlerts
 */
const SettingsUserPrescriptionAlerts: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, settingModel.currentSection);
  }, [settingsUserModel.settingsList]);

  return <SettingsForm settings={[{ title: intl.formatMessage({ id: 'settings.pendingPrescriptionAlerts' }), settings: settingsByCurrentSection }]} />;
});
SettingsUserPrescriptionAlerts.displayName = 'SettingsUserPrescriptionAlerts';

export default SettingsUserPrescriptionAlerts;
