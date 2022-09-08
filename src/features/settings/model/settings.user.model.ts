import { makeAutoObservable, observable } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';

import {
  fetchAllSettings,
  fetchSettings,
  saveApplicationSettings,
  addApplicationSetting,
  saveSetting,
  refreshSettings,
  updateSettingsById,
  ISetting,
  SettingTypeEnum,
  ISettingAll,
  EntityTypeEnum,
} from 'shared/api/settings';
import { setUserSettings } from 'shared/api/user';
import { settingsModel } from '..';

class SettingsUserModel {
  public userSettings: ISetting[] = [];

  public settingsList: ISettingAll[] = [];

  public showModalSetUserDefaults = false;

  constructor() {
    makeAutoObservable(
      this,
      {
        settingsList: observable.shallow,
        showModalSetUserDefaults: observable,
      },
      { autoBind: true }
    );
  }

  *getApplicationSettings() {
    let response: ISettingAll[] = [];
    try {
      const output: AjaxResponse<ISettingAll[]> = yield lastValueFrom(fetchAllSettings().pipe(startWith([])));
      response = output.response ?? [];
      this.settingsList = response;
    } catch {}
    return response;
  }

  *saveApplicationSettings(settings: ISetting[]) {
    let response: ISetting[] = [];
    try {
      const output: AjaxResponse<ISetting[]> = yield lastValueFrom(saveApplicationSettings(settings).pipe(startWith([])));
      response = output.response ?? [];
    } catch {}
    return response;
  }

  *getSettings() {
    let response: ISetting[] = [];
    try {
      const output: AjaxResponse<ISetting[]> = yield lastValueFrom(fetchSettings(SettingTypeEnum.USER).pipe(startWith([])));
      response = output.response ?? [];
    } catch {}
    return response;
  }

  *saveSetting(settingId: number, value?: string) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(saveSetting(SettingTypeEnum.USER, settingId, value ?? null).pipe(startWith(null)));
      response = output.response;
    } catch {}
    return response;
  }

  *addUserSetting(applicationID: number, name: string, displayName: string) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(
        addApplicationSetting({ type: SettingTypeEnum.USER, applicationID, name, displayName }).pipe(startWith(null))
      );
      response = output.response;
    } catch {}
    return response;
  }

  *setUserSettings(userId: number) {
    let response: ISetting[] = [];
    try {
      const output: AjaxResponse<ISetting[]> = yield lastValueFrom(setUserSettings(userId).pipe(startWith([])));
      response = output.response ?? [];
    } catch {}
    return response;
  }

  /**
   * Updates every user in the practice with the Service Level,
   * Eligibility, Formulary and Drug History Download settings.
   * @param {number} practiceId - Practice Identification
   * @param {array} settings - LIst of settings to be copied to each user
   */
  *copyElectronicSettings(practiceId: number, settings: ISetting[]) {
    let response: ISetting[] = [];
    try {
      const output: AjaxResponse<ISetting[]> = yield lastValueFrom(updateSettingsById(SettingTypeEnum.PRACTICE, practiceId, settings).pipe(startWith([])));
      response = output.response ?? [];
    } catch {}
    return response;
  }

  *refreshSettings(practiceId: number, userId: number) {
    try {
      yield lastValueFrom(refreshSettings(practiceId, userId).pipe(startWith(null)));
    } catch {}
  }

  handleModalSetUserDefaults() {
    this.showModalSetUserDefaults = !this.showModalSetUserDefaults;
  }

  setUserDefaults() {
    const settings = settingsModel.setDefaults(EntityTypeEnum.USER);
    settingsModel.saveSettings(settings, undefined);
    this.handleModalSetUserDefaults();
  }
}

const settingsUserModel = new SettingsUserModel();
export default settingsUserModel;
