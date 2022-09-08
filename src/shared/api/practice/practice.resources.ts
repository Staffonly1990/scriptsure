import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import type { IUser } from 'shared/api/user';
import { IDoctorData, IPractice } from './practice.types';

export const getDoctorsPractice = (data: number) =>
  request<IDoctorData[]>({
    url: `${API_URL_PLATFORM}/v1.0/practice/doctors/${data}`,
    method: 'GET',
  });

/**
 * Sets the session state settings for the practice. Process removes
 * all current practice settings, gets the current practiceId settings,
 * and sets the session with the current practice settings.
 * @param {number} practiceId - Practice identification
 */
export const setPracticeSettings = (practiceId: number) =>
  request<boolean[]>({
    url: `${API_URL_PLATFORM}/v1.0/practice/practice/setting/${practiceId}`,
    method: 'GET',
  });

/**
 * Switches a specific user within a specific practice
 */
export const switchPracticeUser = (payload: { prescriber: IUser; practice: IPractice }) =>
  request<{ serviceLevel: number }>({
    url: `${API_URL_PLATFORM}/v1.0/registration/user/${payload.practice.id}/${payload.prescriber.id}`,
    method: 'PUT',
    body: { ...payload },
  });

/**
 * Registers all practices for a specific user
 * @method platform.services.RegisterService#registerUser
 * @returns {angular.IPromise<IRegisterResponse>}
 */
/*
messageId: "1BAC75A86FB1449CB74BF88B8804A52A"
practice: {practiceId: 322, prescribingName: "CureIt, Inc.", addressLine1: "55 South Street", city: "New York",…}
addressLine1: "55 South Street"
city: "New York"
phone: "5189595959"
practiceId: 322
prescribingName: "CureIt, Inc."
state: "NY"
zip: "10021"
response: {Status: {Code: "010"}}
Status: {Code: "010"}
Code: "010"
serviceLevel: 190
spi: "3620983069001"
user: {userId: 3369, firstName: "Sergey", lastName: "Demin", dea: "SD2342134", npi: "1231241235"}
dea: "SD2342134"
firstName: "Sergey"
lastName: "Demin"
npi: "1231241235"
userId: 3369
*/
export const registerUser = (payload: { serviceLevel: number }, userId: number) =>
  request<{ response: { Error: { Description: string } } }>({
    url: `${API_URL_PLATFORM}/v1.0/registration/user/${userId}`,
    method: 'POST',
    body: { ...payload },
  });

// TODO: developer (Demin) - EditProfile \/
/**
 * Updates a SPI number manually from UI
 * @param {number} practiceId
 * @param {number} userId
 * @param {string} spi
 * @returns {angular.IPromise<any>}
 */
export const saveSpi = (payload: { practiceId: number; userId: number; spi: string }) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/registration/spi`,
    method: 'POST',
    body: { ...payload },
  });
// TODO: developer (Demin) - EditProfile /\

export const getPracticeUsers = (practiceId: string | number) =>
  request<IUser>({
    url: `${API_URL_PLATFORM}/v1.0/practice/${practiceId}`,
    method: 'GET',
  });

export const getAdminPractice = (practiceId: string | number) =>
  request<IUser>({
    url: `${API_URL_PLATFORM}/v1.0/admin/practice/users/${practiceId}?limit=500&offset=0`,
    method: 'GET',
  });

export const getCurrentAdminPractice = (practiceId: string | number) =>
  request<IPractice>({
    url: `${API_URL_PLATFORM}/v1.0/admin/practice/${practiceId}`,
    method: 'GET',
  });

export const updateCurrentAdminPractice = (practiceId: string | number, payload: IPractice) =>
  request<IPractice>({
    url: `${API_URL_PLATFORM}/v1.0/admin/practice/${practiceId}`,
    method: 'PUT',
    body: { ...payload },
  });

export const addNewPractice = (payload: IPractice) =>
  request<IPractice>({
    url: `${API_URL_PLATFORM}/v1.0/admin/practice`,
    method: 'POST',
    body: { ...payload },
  });

export const getPracticeList = (organizationId: number, limit?: number, offset?: number) =>
  request<IPractice[]>({
    url: `${API_URL_PLATFORM}/v1.0/admin/practice?limit=${limit ?? 500}&offset=${offset ?? 0}&organizationId=${organizationId}`,
    method: 'GET',
  });
