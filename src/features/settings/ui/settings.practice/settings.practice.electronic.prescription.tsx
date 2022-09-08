import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { ENamesSetting } from 'shared/api/settings';
import SettingsForm from '../settings.form/settings.form';
import { getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import settingModel from '../../model/settings.model';
import { useIntl } from 'react-intl';

/**
 * @view SettingsPracticeElectronicPrescription
 */
const SettingsPracticeElectronicPrescription: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.PracticeSetting, settingModel.currentSection)?.filter(
      (setting) => setting.name !== 'Services'
    );
  }, [settingsUserModel.settingsList]);

  return <SettingsForm settings={[{ title: intl.formatMessage({ id: 'settings.electronicPrescription' }), settings: settingsByCurrentSection }]} />;
});
SettingsPracticeElectronicPrescription.displayName = 'SettingsPracticeElectronicPrescription';

export default SettingsPracticeElectronicPrescription;
