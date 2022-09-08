import React, { FC, useMemo } from 'react';
import { filter } from 'lodash';
import { useIntl } from 'react-intl';

import { getOtherSettingTitle, getSettingTitle } from '../../lib/get.setting.title';
import settingsUserModel from '../../model/settings.user.model';
import SettingsForm from '../settings.form/settings.form';
import { observer } from 'mobx-react-lite';
import settingModel from '../../model/settings.model';
import { ENamesSetting } from 'shared/api/settings';

/**
 * @view SettingsUserPrint
 */
const SettingsUserPrint: FC = observer(() => {
  const intl = useIntl();

  const settingsByCurrentSection = useMemo(() => {
    return getSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, settingModel.currentSection).concat(
      getOtherSettingTitle(settingsUserModel.settingsList, ENamesSetting.UserSetting, 'Patient Adherence')
    );
  }, [settingsUserModel.settingsList]);

  const accessories = {
    discount: { in: [24], out: [] },
    prescriptionCopies: { in: [23], out: [] },
    summarySheet: { in: [21], out: [] },
    other: { in: [], out: [21, 22, 23, 24] },
  };

  const discountSettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.discountCard' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.discount.in.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  const prescriptionCopiesSettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.prescriptionCopies' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.prescriptionCopies.in.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  const summarySheetSettings = useMemo(() => {
    return {
      title: intl.formatMessage({ id: 'settings.summarySheet' }),
      settings: filter(settingsByCurrentSection, (title) => accessories.summarySheet.in.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  const otherSettings = useMemo(() => {
    return {
      title: '',
      settings: filter(settingsByCurrentSection, (title) => !accessories.other.out.includes(title?.titleId)),
    };
  }, [settingsUserModel.settingsList]);

  return <SettingsForm settings={[discountSettings, prescriptionCopiesSettings, summarySheetSettings, otherSettings]} />;
});
SettingsUserPrint.displayName = 'SettingsUserPrint';

export default SettingsUserPrint;
