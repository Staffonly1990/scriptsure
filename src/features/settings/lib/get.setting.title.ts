import { forEach } from 'lodash';
import { ENamesSettingType, ESettingMainId, ISettingAll, ISettingSection, ISettingTitle } from 'shared/api/settings';

export function getOtherSettingTitle(list: ISettingAll[], nameSetting: ENamesSettingType, section: string) {
  const findSetting = list.find((settingElement) => settingElement.mainId === Number(ESettingMainId[nameSetting]));
  if (findSetting?.SettingSection?.length) {
    const findSection = findSetting?.SettingSection.find((sectionInner) => sectionInner.name === String(section));
    if (findSection?.SettingHeading?.length) {
      if (findSection?.SettingHeading?.length > 1) {
        let arr: ISettingTitle[] = [];
        forEach(findSection?.SettingHeading, (heading) => {
          arr = arr.concat(heading.SettingTitle);
        });
        return arr;
      }
      const findHeading = findSection?.SettingHeading?.[0];
      if (findHeading?.SettingTitle?.length) {
        return findHeading?.SettingTitle;
      }
    }
  }

  return [];
}

export function getSettingTitle(list: ISettingAll[], nameSetting: ENamesSettingType, currentSection: ISettingSection | null) {
  const section = list?.find((setting) => setting.name === nameSetting)?.SettingSection.find((innerSection) => innerSection.name === currentSection?.name);
  if (!section) return [];
  if (section?.SettingHeading?.length) {
    if (section?.SettingHeading.length > 1) {
      let arr: ISettingTitle[] = [];
      forEach(section?.SettingHeading, (heading) => {
        arr = arr.concat(heading.SettingTitle);
      });
      return arr;
    }

    const findHeading = section?.SettingHeading?.[0];
    if (findHeading?.SettingTitle?.length) {
      return findHeading?.SettingTitle;
    }
  }

  return [];
}
