import { find } from 'lodash';

export function isShow(title, setting, valuesForm) {
  if (setting.parentSettingId && setting.parentSettingId > 0) {
    const parent = find(title.Setting, (titleSetting) => titleSetting.settingId === setting.parentSettingId);
    if (parent) {
      if (setting.condition && setting.condition.length > 0) {
        if (valuesForm[parent.key] !== undefined) {
          return valuesForm[parent.key] === Boolean(Number(setting.condition));
        }

        if (parent.value) {
          return parent.value.toString() === setting.condition;
        }

        return false;
      }
      if (parent.value) {
        return parent.value === '0';
      }
      return false;
    }
  }

  return true;
}
