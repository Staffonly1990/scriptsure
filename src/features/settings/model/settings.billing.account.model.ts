import { makeAutoObservable, observable, computed } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';
import { reduce } from 'lodash';

import { fetchSettingsWith, saveSettingWith, addSetting, ISetting, IBillingAccountSetting, SettingTypeEnum } from 'shared/api/settings';

class SettingsBillingAccountModel {
  public accountSettings: ISetting[] = [];

  constructor() {
    // TODO: add observable and etc.
    makeAutoObservable(this, { accountSettings: observable }, { autoBind: true });
  }

  /**
   * Get the billing account settings for billing account
   * @param {number} billingAccountId - Billing Account associated.
   */
  *getSettings(billingAccountId: number) {
    let response: IBillingAccountSetting[] = [];
    try {
      const output: AjaxResponse<IBillingAccountSetting[]> = yield lastValueFrom(
        fetchSettingsWith({ settingType: SettingTypeEnum.ACCOUNT, id: billingAccountId }).pipe(startWith([]))
      );
      response = output.response ?? [];
    } catch {}
    return response;
  }

  /**
   * Save the Billing Account Setting for a given billingAccountId and settingId
   * @param {number} billingAccountId - Billing Account ID
   * @param {number} settingId - Setting ID
   * @param {string} value - Value to be set.
   */
  *saveSetting(billingAccountId: number, settingId: number, value: string) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(
        saveSettingWith({ settingType: SettingTypeEnum.ACCOUNT, id: billingAccountId, settingId, value }).pipe(startWith(null))
      );
      response = output.response;
    } catch {}
    return response;
  }

  /**
   * Add a Billing Account Setting
   * @param {number} applicationID - Application ID
   * @param {string} name - Name of the setting to add
   * @param {string} displayName - Display Name of the setting
   */
  *addBillingAccountSetting(applicationID: number, name: string, displayName: string) {
    let response: Nullable<ISetting> | undefined;
    try {
      const output: AjaxResponse<ISetting> = yield lastValueFrom(
        addSetting(SettingTypeEnum.ACCOUNT, { type: SettingTypeEnum.ACCOUNT, applicationID, name, displayName }).pipe(startWith(null))
      );
      response = output.response;
    } catch {}
    return response;
  }

  /**
   * Will return a list of Billing Account Settings for a given billingAccountId
   * @param {number} billingAccountId - Billing Account Id for the current user
   */
  *getBillingAccountSettings(billingAccountId: number) {
    let response: ISetting[] = [];
    try {
      const output: AjaxResponse<IBillingAccountSetting[]> = yield lastValueFrom(
        fetchSettingsWith({ settingType: SettingTypeEnum.ACCOUNT, id: billingAccountId }).pipe(startWith([]))
      );
      response = reduce(
        output.response ?? [],
        (acc, setting) => {
          if (setting?.Setting && setting.Setting.type === SettingTypeEnum.ACCOUNT) acc.push(setting.Setting);
          return acc;
        },
        [] as ISetting[]
      );
      this.accountSettings = response;
    } catch {}
    return response;
  }
}

const settingsBillingAccountModel = new SettingsBillingAccountModel();
export default settingsBillingAccountModel;
