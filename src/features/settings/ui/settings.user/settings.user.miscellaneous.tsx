import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { getOtherSettingTitle, getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import SettingsForm from '../settings.form/settings.form';
import { filter } from 'lodash';
import settingModel from '../../model/settings.model';
import { ENamesSetting } from 'shared/api/settings';

/**
 * @view SettingsUserMiscellaneous
 */
const SettingsUserMiscellaneous: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, settingModel.currentSection);
  }, [settingsUserModel.settingsList]);

  const accessories = {
    general: { in: [], out: [49, 51] },
    drugHistory: { in: [51], out: [] },
    drugList: { in: [49], out: [] },
  };

  const generalSettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.general' }),
      settings: filter(settingsByCurrentSection, (title) => !accessories.general.out.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  const drugHistorySettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.drugHistory' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.drugHistory.in.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  const drugListSettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.drugList' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.drugList.in.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  const prescriptionWorkFlowSettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.prescriptionWorkFlow' }),
      settings: getOtherSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, 'Prescription Work Flow'),
    };
  }, [settingsUserModel.settingsList]);

  return <SettingsForm settings={[generalSettings, drugHistorySettings, drugListSettings, prescriptionWorkFlowSettings]} />;
});
SettingsUserMiscellaneous.displayName = 'SettingsUserMiscellaneous';

export default SettingsUserMiscellaneous;
