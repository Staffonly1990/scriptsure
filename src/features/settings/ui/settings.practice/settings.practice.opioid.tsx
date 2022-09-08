import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import { ENamesSetting } from 'shared/api/settings';
import settingModel from '../../model/settings.model';
import SettingsForm from '../settings.form/settings.form';
import { observer } from 'mobx-react-lite';

/**
 * @view SettingsPracticeOpioid
 */
const SettingsPracticeOpioid: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.PracticeSetting, settingModel.currentSection);
  }, [settingsUserModel.settingsList]);

  return (
    <SettingsForm
      settings={[
        {
          title: intl.formatMessage({ id: 'settings.OpioidLimits' }),
          settings: settingsByCurrentSection,
        },
      ]}
    />
  );
});
SettingsPracticeOpioid.displayName = 'SettingsPracticeOpioid';

export default SettingsPracticeOpioid;
