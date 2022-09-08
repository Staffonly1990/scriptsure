import { makeAutoObservable, observable, computed } from 'mobx'; // flowResult
import { computedFn } from 'mobx-utils';
import { find, forEach, has, map } from 'lodash';

import {
  EntityTypeEnum,
  ISetting,
  ISettingSection,
  ISettingTitle,
  ISettingUnique,
  refreshSettings,
  conditions,
  ISettingAll,
  ISettingHeading,
} from 'shared/api/settings';
import { OActionStatus, ActionStatus } from 'shared/lib/model';
import { userModel } from 'features/user';
import { securityModel } from 'features/restrictions';

import { findSetting } from '../lib/find.setting';
import settingsUserModel from './settings.user.model';
import settingsPracticeModel from './settings.practice.model';
import { lastValueFrom } from 'rxjs';

class SettingsModel {
  public settings = null;

  public notify = '';

  public currentSection: ISettingSection | null = null;

  public showModalPracticeConflict = false;

  public showModalDiscardChanges = false;

  public status: Record<'fetch' | 'login' | 'logout', ActionStatus> = {
    fetch: OActionStatus.Initial,
    login: OActionStatus.Initial,
    logout: OActionStatus.Initial,
  };

  public errors: Record<'fetch' | 'login' | 'logout', Nullable<string>> = {
    fetch: null,
    login: null,
    logout: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        settings: observable,
        notify: observable,
        showModalPracticeConflict: observable,
        showModalDiscardChanges: observable,
        currentSection: observable,
        status: observable.shallow,
        errors: observable.shallow,
        appID: computed,
      },
      { autoBind: true }
    );
  }

  /** @experimental */
  get appID() {
    if (userModel?.data?.Applications?.length) {
      return userModel.data.Applications[0].id;
    }

    return undefined;
  }

  /**
   * Retrieves the setting for a specific setting name and settingType
   * @param name - Identifier for the setting to be retrieved
   * @param settingType - Title for the setting. Technically the name should be unique
   *  across all settings, but sending in the settingType ensures that the setting
   *  is unique across the setting section.
   */
  get = computedFn(
    (name: string, settingType: string): string | number | boolean | undefined | null => {
      return findSetting(userModel?.data?.settings, name, settingType);
    },
    { keepAlive: true }
  );

  /**
   * Save the userSettings for a given settingId
   * @param {number} settingId - Setting ID
   * @param {string} value - Value to be set.
   */
  *save(settingId: number, value: string) {
    const setting = yield settingsUserModel.saveSetting(settingId, value);
    if (userModel?.data?.currentPractice?.id && userModel?.data?.user?.id) {
      yield settingsUserModel.refreshSettings(userModel.data.currentPractice.id, userModel.data.user.id);
    }
    yield userModel.refreshUser();
  }

  checkRestrictions = computedFn((setting: ISettingUnique, title: ISettingTitle) => {
    if (this.currentSection?.sectionId === 7 || this.currentSection?.sectionId === 13) {
      if (setting.parentSettingId && setting.parentSettingId > 0 && setting.entityType === 2) {
        const parent = find(title.Setting, (titleSetting) => titleSetting.settingId === setting.parentSettingId);

        if (parent) {
          const s = find(settingsPracticeModel.practiceSettings, (innerSetting: ISettingUnique) => innerSetting.key === parent.key);

          let result;
          if (s) {
            if (s.value) {
              result = s.value;
            } else {
              result = s.defaultValue;
            }
          } else {
            result = null;
          }

          if (Boolean(Number(result)) === Boolean(true)) {
            return true;
          }
          if (setting.controlType === 1) {
            return !securityModel.can('DrugCheckSettingChange');
          }

          if (setting.controlType === 4) {
            return !securityModel.can('DrugToleranceSettingChange');
          }
        } else {
          if (setting.controlType === 1) {
            return !securityModel.can('DrugCheckSettingChange');
          }

          if (setting.controlType === 4) {
            return !securityModel.can('DrugToleranceSettingChange');
          }
        }
      } else {
        if (setting.controlType === 1) {
          return !securityModel.can('DrugCheckSettingChange');
        }

        if (setting.controlType === 4) {
          return !securityModel.can('DrugToleranceSettingChange');
        }
      }
    }

    return false;
  });

  checkPracticeControl(setting: ISettingUnique, value: boolean) {
    if (setting.entityType === 2 && value === Boolean(false)) {
      if (setting.key && Boolean(Number(this.get(setting.key, 'Practice'))) === Boolean(true)) {
        this.showModalPracticeConflict = true;
        return false;
      }
    }
    return true;
  }

  private constructSettings = computedFn((values) => {
    const settings: ISetting[] = [];
    forEach(settingsUserModel.settingsList, (settingAll) => {
      forEach(settingAll.SettingSection, (settingSection) => {
        if (settingSection.sectionId === this.currentSection?.sectionId) {
          forEach(settingSection.SettingHeading, (settingHeading) => {
            forEach(settingHeading.SettingTitle, (settingTitle) => {
              forEach(settingTitle.Setting, (setting) => {
                if (setting?.key) {
                  if (setting.entityType === EntityTypeEnum.PRACTICE) {
                    settings.push({
                      practiceID: settingsPracticeModel.currentPractice,
                      settingID: setting.settingId,
                      value: conditions?.[values?.[setting.key]] || values?.[setting.key] || setting.value,
                    });
                  } else {
                    settings.push({
                      userID: userModel.data?.user.id,
                      settingID: setting.settingId,
                      value: conditions?.[values?.[setting.key]] || values?.[setting.key] || setting.value,
                    });
                  }
                }
              });
            });
          });
        }
      });
    });

    return settings;
  });

  saveForm(values: any, reset: () => void) {
    const settings = this.constructSettings(values);
    let canSave = true;
    if (find(settings, 'practiceID')) {
      canSave = securityModel.can('SetupSettingEdit');
    }
    if (find(settings, 'userID')) {
      canSave = securityModel.can('UserSettingEdit');
    }
    if (canSave) {
      this.saveSettings(settings, reset);
    }
  }

  *saveSettings(settings: ISetting[], resetForm?: (value: object) => void) {
    const response: ISetting[] = yield settingsUserModel.saveApplicationSettings(settings);
    if (response.length) {
      if (resetForm) {
        resetForm({});
      }

      if (userModel.data?.currentPractice?.id && userModel.data?.user?.id) {
        yield lastValueFrom(refreshSettings(userModel.data.currentPractice.id, userModel.data.user.id)).then(async () => {
          await settingsUserModel.getApplicationSettings();
          await userModel.refreshUser();
          if (resetForm) {
            settingsPracticeModel.setPractice();
            this.notify = 'SAVE_SUCCESS';
          } else {
            await settingsPracticeModel.load();
            this.notify = 'SAVE_SUCCESS';
          }
        });
      }
    }
  }

  selectSection(section) {
    const newSection = { ...section };
    newSection.SettingHeading = map(section.SettingHeading, (settingHeading: any) => {
      const newSettingHeading = { ...settingHeading };
      newSettingHeading.SettingTitle = map(newSettingHeading.SettingTitle, (settingTitle: any) => {
        const newSettingTitle = { ...settingTitle };
        newSettingTitle.Setting = map(newSettingTitle.Setting, (setting: any) => {
          const newSetting = { ...setting };
          if (!newSetting.value) {
            newSetting.value = newSetting.defaultValue;
          }

          return newSetting;
        });

        return newSettingTitle;
      });

      return newSettingHeading;
    });
    this.currentSection = newSection;
  }

  public selectSetting = (setting: ISettingUnique, getValuesFromForm: (key: string) => string | number | boolean) => {
    if (setting.functionCall && setting.functionCall.length > 0) {
      if (setting.functionCall.indexOf('.') === -1) {
        const fn: any = this[setting.functionCall] || settingsPracticeModel[setting.functionCall];
        if (typeof fn === 'function') {
          fn(getValuesFromForm);
        }
      }
    }
  };

  cancelSetting(isDirty) {
    if (isDirty) {
      this.showModalDiscardChanges = true;
    }
  }

  *copyElectronicSetting(getValuesFromForm) {
    const settings: ISetting[] = [];
    let serviceLevel = 0;
    forEach(settingsUserModel.settingsList, (settingMain: ISettingAll) => {
      forEach(settingMain.SettingSection, (settingSection: ISettingSection) => {
        forEach(settingSection.SettingHeading, (settingHeading: ISettingHeading) => {
          forEach(settingHeading.SettingTitle, (settingTitle: ISettingTitle) => {
            forEach(settingTitle.Setting, (setting: ISettingUnique) => {
              if (setting.entityType === EntityTypeEnum.PRACTICE && setting.settingId && setting.settingId >= 79 && setting.settingId <= 86) {
                switch (setting.settingId) {
                  // NEW PRESCRIPTION
                  case 79:
                    if (setting.value === '1') {
                      serviceLevel += 2;
                    }
                    break;
                  // REFILL PRESCRIPTION
                  case 80:
                    if (setting.value === '1') {
                      serviceLevel += 4;
                    }
                    break;
                  // CANCEL PRESCRIPTION
                  case 81:
                    if (setting.value === '1') {
                      serviceLevel += 8;
                    }
                    break;
                  // CONTROLLED PRESCRIPTION
                  case 82:
                    if (setting.value === '1') {
                      serviceLevel += 32;
                    }
                    break;
                  // PATIENT ELIGIBILITY REQUESTS
                  case 83:
                    settings.push({
                      settingID: 5,
                      value: conditions[getValuesFromForm(setting.key)],
                    });
                    break;
                  // FORMULARY SEARCH
                  case 84:
                    settings.push({
                      settingID: 6,
                      value: conditions[getValuesFromForm(setting.key)],
                    });
                    break;
                  // DOWNLOAD DRUG HISTORY
                  case 85:
                    settings.push({
                      settingID: 7,
                      value: conditions[getValuesFromForm(setting.key)],
                    });
                    break;
                  // SHOW DRUG HISTORY CONFIRMATION
                  case 86:
                    settings.push({
                      settingID: 8,
                      value: conditions[getValuesFromForm(setting.key)],
                    });
                    break;
                  default:
                    break;
                }
              }
            });
          });
        });
      });
    });

    settings.push({
      settingID: 0,
      value: serviceLevel,
    });

    if (settingsPracticeModel.currentPractice) {
      const response = settingsUserModel.copyElectronicSettings(settingsPracticeModel.currentPractice, settings);
      if (response && userModel.data?.currentPractice?.id && userModel.data?.user?.id) {
        yield settingsUserModel.refreshSettings(userModel.data.currentPractice.id, userModel.data.user.id);
        yield userModel.refreshUser();
        if (userModel.status.refreshUser === OActionStatus.Fulfilled) {
          this.notify = 'SAVE_SUCCESS';
        }
      }
    }
  }

  setDefaults(entityType) {
    const settings: ISetting[] = [];
    forEach(settingsUserModel.settingsList, (settingMain) => {
      if (settingMain.entityType === entityType) {
        forEach(settingMain.SettingSection, (settingSection) => {
          if (has(settingSection, 'SettingHeading')) {
            forEach(settingSection.SettingHeading, (settingHeading) => {
              forEach(settingHeading.SettingTitle, (settingTitle) => {
                forEach(settingTitle.Setting, (setting) => {
                  if (setting.entityType === EntityTypeEnum.PRACTICE) {
                    settings.push({
                      practiceID: settingsPracticeModel.currentPractice,
                      settingID: setting.settingId,
                      value: setting.defaultValue,
                    });
                  } else {
                    settings.push({
                      userID: userModel.data?.user.id,
                      settingID: setting.settingId,
                      value: setting.defaultValue,
                    });
                  }
                });
              });
            });
          }
        });
      }
    });
    return settings;
  }
}

const settingModel = new SettingsModel();
export default settingModel;
