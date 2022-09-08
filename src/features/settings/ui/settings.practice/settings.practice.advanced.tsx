import React, { FC, useMemo } from 'react';
import { filter } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { ENamesSetting } from 'shared/api/settings';
import settingsUserModel from '../../model/settings.user.model';
import SettingsForm from '../settings.form/settings.form';
import { getSettingTitle } from '../../lib/get.setting.title';
import settingModel from '../../model/settings.model';

/**
 * @view SettingsPracticeAdvanced
 */
const SettingsPracticeAdvanced: FC = observer(() => {
  const intl = useIntl();
  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.PracticeSetting, settingModel.currentSection);
  }, [settingsUserModel.settingsList]);

  const accessories = {
    general: { in: [25, 26, 27, 52], out: [] },
    prescription: { in: [29, 69, 70], out: [] },
    pharmacy: { in: [55, 68, 71, 72], out: [] },
    other: { in: [], out: [25, 26, 27, 29, 52, 55, 68, 69, 70, 71, 72] },
  };

  const generalSettings = useMemo(
    () => ({
      title: intl.formatMessage({ id: 'settings.general' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.general.in.includes(title?.titleId)),
    }),
    []
  );

  const prescriptionSettings = useMemo(
    () => ({
      title: intl.formatMessage({ id: 'settings.prescription' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.prescription.in.includes(title?.titleId)),
    }),
    []
  );

  const pharmacySettings = useMemo(
    () => ({
      title: intl.formatMessage({ id: 'settings.pharmacy' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.pharmacy.in.includes(title?.titleId)),
    }),
    []
  );

  const otherSettings = useMemo(
    () => ({
      title: '',
      settings: filter(settingsByCurrentSection, (title) => !accessories.other.out.includes(title?.titleId)),
    }),
    []
  );

  return <SettingsForm settings={[generalSettings, prescriptionSettings, pharmacySettings, otherSettings]} />;
});
SettingsPracticeAdvanced.displayName = 'SettingsPracticeAdvanced';

export default SettingsPracticeAdvanced;
