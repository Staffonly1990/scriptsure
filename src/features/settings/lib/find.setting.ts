import { find } from 'lodash';
import { ISetting } from 'shared/api/settings';

export function findSetting(settings: ISetting[] | undefined, name: string, settingType: string) {
  if (settings?.length) {
    const matchedSetting: ISetting | undefined = find(settings, (setting: ISetting) => setting.name === name && setting.type === settingType);

    if (matchedSetting) {
      if (matchedSetting.value) return matchedSetting.value;
      return matchedSetting.defaultValue;
    }

    return null;
  }

  return null;
}
