import { makeAutoObservable, observable } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';

import {
  addSetting,
  EntityTypeEnum,
  fetchSettingsWith,
  IPracticeSetting,
  ISetting,
  ISettingAll,
  ISettingHeading,
  ISettingSection,
  ISettingTitle,
  ISettingUnique,
  saveSettingWith,
  setBusinessUnitSettings,
  SettingTypeEnum,
} from 'shared/api/settings';
import { IPractice, setPracticeSettings } from 'shared/api/practice';
import { filter, find, forEach, map } from 'lodash';
import settingsUserModel from './settings.user.model';
import { userModel } from '../../user';
import { settingsModel } from '..';

class SettingsPracticeModel {
  public practiceSettings: ISettingUnique[] = [];

  public practices: IPractice[] = [];

  public currentPractice: number | undefined = undefined;

  public showModalSetPracticeDefaults = false;

  constructor() {
    // TODO: add observable and etc.
    makeAutoObservable(
      this,
      {
        currentPractice: observable,
        showModalSetPracticeDefaults: observable,
      },
      { autoBind: true }
    );
  }

  *load() {
    const response = yield settingsUserModel.getApplicationSettings();
    this.practices = [];
    if (response) {
      forEach(userModel.data?.practices, (practice: IPractice) => {
        const isAdministrator = find(userModel.data?.businessunits, (businessunit) => {
          return businessunit.id === practice.businessUnitId;
        });

        if (isAdministrator) {
          if (isAdministrator.businessunitadmins) {
            this.practices = this.practices.concat(practice);
          }
        }
      });
      if (this.practices.length > 0) {
        this.currentPractice = this.practices[0].id;
        this.setPractice();
      } else {
        settingsUserModel.settingsList = filter(settingsUserModel.settingsList, (currentSetting: ISettingAll) => currentSetting.mainId !== 1);
      }
    }
  }

  *setPractice() {
    if (this.currentPractice) {
      const response: IPracticeSetting[] = yield this.getSettings(this.currentPractice);
      if (response) {
        settingsUserModel.settingsList = map(settingsUserModel.settingsList, (settingMain: ISettingAll) => {
          const newSettingMain = { ...settingMain };
          if (settingMain.entityType === EntityTypeEnum.PRACTICE) {
            newSettingMain.SettingSection = map(settingMain.SettingSection, (settingSection: ISettingSection) => {
              const newSettingSection = { ...settingSection };
              newSettingSection.SettingHeading = map(settingSection.SettingHeading, (settingHeading: ISettingHeading) => {
                const newSettingHeading = { ...settingHeading };
                newSettingHeading.SettingTitle = map(settingHeading.SettingTitle, (settingTitle: ISettingTitle) => {
                  const newSettingTitle = { ...settingTitle };
                  newSettingTitle.Setting = map(settingTitle.Setting, (setting: ISettingUnique) => {
                    const newSetting = { ...setting };
                    const practiceSetting = find(response, (practice: IPracticeSetting) => newSetting.settingId === practice.settingID);

                    if (practiceSetting) {
                      newSetting.value = practiceSetting.value;
                    } else {
                      newSetting.value = newSetting.defaultValue;
                    }
                    this.practiceSettings = this.practiceSettings.concat(newSetting);

                    return newSetting;
                  });
                  return newSettingTitle;
                });
                return newSettingHeading;
              });
              return newSettingSection;
            });
          }
          return newSettingMain;
        });
      }
    }
  }
  /**
   * Get the practiceSettings for the given category
   */

  *getSettings(practiceId: number) {
    let response: IPracticeSetting[] = [];
    try {
      const output: AjaxResponse<IPracticeSetting[]> = yield lastValueFrom(fetchSettingsWith({ settingType: 'practice', id: practiceId }).pipe(startWith([])));
      response = output.response ?? [];
    } catch {}
    return response;
  }

  /**
   * Save the practiceSettings for a given category {'user','practice','account'}, categoryId, and  settingId
   * @param {number} practiceId - PracticeId
   * @param {number} settingName - Setting Name
   * @param {string} value - Value to be set.
   */
  *saveSetting(practiceId: number, settingName: string, value: string) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(
        saveSettingWith({ settingType: SettingTypeEnum.ACCOUNT, id: practiceId, settingName, value }).pipe(startWith(null))
      );
      response = output.response;
    } catch {}
    return response;
  }

  /**
   * @param {number} applicationID - Application ID
   * @param {string} name - Name of the setting to add
   * @param {string} displayName - Display Name of the setting
   */
  *addPracticeSetting(applicationID: number, name: string, displayName: string) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(
        addSetting(SettingTypeEnum.ACCOUNT, { type: SettingTypeEnum.ACCOUNT, applicationID, name, displayName }).pipe(startWith(null))
      );
      response = output.response;
    } catch {}
    return response;
  }

  *setPracticeSettings(practiceId: number) {
    let response: ISetting[] = [];
    try {
      const output: AjaxResponse<ISetting[]> = yield lastValueFrom(setPracticeSettings(practiceId).pipe(startWith([])));
      response = output.response ?? [];
    } catch {}
    return response;
  }

  *setBusinessUnitSettings(businessUnitId: number) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(setBusinessUnitSettings(businessUnitId).pipe(startWith(null)));
      response = output.response;
    } catch {}
    return response;
  }

  handleModalSetPracticeDefaults() {
    this.showModalSetPracticeDefaults = !this.showModalSetPracticeDefaults;
  }

  setPracticeDefaults() {
    const settings = settingsModel.setDefaults(EntityTypeEnum.PRACTICE);
    settingsModel.saveSettings(settings, undefined);
    this.handleModalSetPracticeDefaults();
  }
}

const settingsPracticeModel = new SettingsPracticeModel();
export default settingsPracticeModel;
