import { isNil } from 'lodash';
import { API_URL_SCRIPTSURE, API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import type { IBusinessUnit, ISetting } from './settings.types';

export const getHiddenComponents = (id: string | number) =>
  request({
    url: `${API_URL_SCRIPTSURE}/components/hiddencomponents/list/${id}`,
    method: 'GET',
  });

/**
 * Get all the setting associated with the ScriptSure application from the
 * ScriptSure backend. The JSON object describes the UI and returns the current
 * values set for each settingId for the current user.
 */
export const fetchAllSettings = <S = ISetting>() =>
  request<S[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/setting`,
    method: 'GET',
  });

/**
 * Get the settings by a Setting Type
 */
export const fetchSettings = <S = ISetting>(settingType: string) =>
  request<S[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/setting/${settingType}`,
    method: 'GET',
  });

type FetchSettingsWith = { settingType: string; id?: number };
export const fetchSettingsWith = <S = ISetting>(payload: FetchSettingsWith) => {
  const { settingType, id } = payload;
  const url = isNil(id) ? `${API_URL_PLATFORM}/v1.0/settings/${settingType}` : `${API_URL_PLATFORM}/v1.0/settings/${settingType}/${id}`;
  return request<S[]>({
    url,
    method: 'GET',
  });
};

/**
 * Save the settings for a given settingId
 * @param {string} settingType - Setting Type
 * @param {number} settingId - Setting ID
 * @param {string} value - Value to be set.
 */
export const saveSetting = (settingType: string, settingId: number, value: string | null) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/settings/${settingType}/${settingId}`,
    method: 'POST',
    body: { value },
  });

type SaveSettingsWith = {
  settingType: string;
  settingId?: number;
  settingName?: string;
  id?: number;
  value?: string | null;
};
export const saveSettingWith = (payload: SaveSettingsWith) => {
  const { settingType, settingId, settingName, id, value } = payload;
  const url = isNil(id)
    ? `${API_URL_PLATFORM}/v1.0/settings/${settingType}/${settingId ?? settingName}`
    : `${API_URL_PLATFORM}/v1.0/settings/${settingType}/${id}/${settingId ?? settingName}`;
  return request({
    url,
    method: 'POST',
    body: { value },
  });
};

export const updateSettingsById = <S = ISetting>(settingType: string, id: number, settings: S[]) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/settings/${settingType}/${id}`,
    method: 'PUT',
    body: [...settings],
  });

type AddSettingParams = { type: string; applicationID: number; name: string; displayName: string };
export const addSetting = <S = ISetting>(settingType: string, params: AddSettingParams) =>
  request<S>({
    url: `${API_URL_PLATFORM}/v1.0/settings/${settingType}`,
    method: 'POST',
    body: { ...params },
  });

/**
 * Saves all the settings associated with the ScriptSure application to the
 * Platform backend. Code will save the practice and user settings.
 */
export const saveApplicationSettings = <S = ISetting>(settings: S[]) =>
  request<S[]>({
    url: `${API_URL_PLATFORM}/v1.0/settings/application`,
    method: 'POST',
    body: [...settings],
  });

/**
 * Add a new Setting
 * @param {string} settingType - Setting Type
 * @param {number} applicationID - Application ID
 * @param {string} name - Name of the setting to add
 * @param {string} displayName - Display Name of the setting
 */
export const addApplicationSetting = <S = ISetting>(params: AddSettingParams) =>
  request<S>({
    url: `${API_URL_PLATFORM}/v1.0/settings/application`,
    method: 'POST',
    body: { ...params },
  });

/**
 * Refresh settings by resetting the session state for both the user
 * amd practice setting list
 */
export const refreshSettings = (practiceId: number, userId: number) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/settings/refresh/${practiceId}/${userId}`,
    method: 'GET',
  });

/**
 * Sets the req.sessions.business unit settings for the current doctor
 * @param {number} businessUnitId - Current business unit Identification
 */
export const setBusinessUnitSettings = <S = ISetting>(businessUnitId: number) =>
  request<S[]>({
    url: `${API_URL_PLATFORM}/v1.0/admin/businessUnit/setting/${businessUnitId}`,
    method: 'GET',
  });

// TODO: developer (Demin) - EditProfile \/
/**
 * Gets the business unit will available billing account details
 * @param businessUnitId - Business unit identification
 * @returns {IPromise<platform.services.IBusinessUnit[]>}
 */
export const getBusinessUnitDetail = (businessUnitId: number) =>
  request<IBusinessUnit>({
    url: `${API_URL_PLATFORM}/v1.0/admin/businessUnit/detail/${businessUnitId}`,
    method: 'GET',
  });

export const updateSubscription = (payload: {
  accountCode: string | null;
  billingAccountId: number | null;
  subscriptionMonthly: any | null;
  subscriptionYearly: any | null;
}) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/stripe/syncUsers`,
    method: 'PUT',
    body: { ...payload },
  });

// TODO: developer (Demin) - EditProfile /\
