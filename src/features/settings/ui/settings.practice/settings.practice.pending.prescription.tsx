import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';

import { getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import { ENamesSetting } from 'shared/api/settings';
import settingModel from '../../model/settings.model';
import SettingsForm from '../settings.form/settings.form';

/**
 * @view SettingsPracticePendingPrescription
 */
const SettingsPracticePendingPrescription: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.PracticeSetting, settingModel.currentSection);
  }, [settingsUserModel.settingsList]);

  return (
    <SettingsForm
      settings={[
        {
          title: intl.formatMessage({ id: 'settings.pendingPrescriptionAlerts' }),
          settings: settingsByCurrentSection,
        },
      ]}
    />
  );
});
SettingsPracticePendingPrescription.displayName = 'SettingsPracticePendingPrescription';

export default SettingsPracticePendingPrescription;
