import { API_URL_PLATFORM, API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { ISetting } from 'shared/api/settings';
import type { IPractice } from 'shared/api/practice';
import { IFilter, ITaxonomy, IPrescriber, IUser, IUserData, IUserPlatform, IEpcs } from './user.types';

export const fetchUserData = () =>
  request<IUserData>({
    url: `${API_URL_SCRIPTSURE}/v1.0/user`,
    method: 'GET',
  });

// TODO: developer (Demin) - add UserPlatform
export const fetchUserDataPlatform = () =>
  request<IUserPlatform>({
    url: `${API_URL_PLATFORM}/v1.0/user`,
    method: 'GET',
  });

export const fetchTaxonomy = () =>
  request<ITaxonomy[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/taxonomy`,
    method: 'GET',
  });

export const forgotEmail = () =>
  request<Nullable<string>>({
    url: `${API_URL_SCRIPTSURE}/v1.0/user/forgotEmail`,
    method: 'GET',
    responseType: 'text' as XMLHttpRequestResponseType,
  });

export const forgotPassword = () =>
  request<Nullable<string>>({
    url: `${API_URL_SCRIPTSURE}/v1.0/user/forgotEmail`,
    method: 'GET',
    responseType: 'text' as XMLHttpRequestResponseType,
  });

export const grantAccess = (limit?: number, offset?: number) =>
  request<IUser[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/users?limit=${limit ?? 500}&offset=${offset ?? 0}`,
    method: 'GET',
  });

export const requestAccess = (organizationId?: number, limit?: number, offset?: number) =>
  request<IUser[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/users/doctor?limit=${limit ?? 500}&offset=${offset ?? 0}&organizationId=${organizationId}`,
    method: 'GET',
  });

export const userSearch = (payload: IFilter) =>
  request<IUser[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/search`, // ?limit=500&offset=0
    method: 'POST',
    body: { ...payload },
  });

/**
 * Sets the req.sessions.settings for the current doctor
 * @param {number} userId - Current User Identification
 */
export const setUserSettings = <S = ISetting>(userId: number) =>
  request<S[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/doctor/setting/${userId}`,
    method: 'GET',
  });

export const getUserDetail = <S = ISetting>(userId: number) =>
  request<S[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/${userId}`,
    method: 'GET',
  });

/**
 * Sets the currentPractice and currentPrescriber on the session
 * @param practice - Practice entity
 * @param prescriber - Prescriber entity
 * @returns OK
 */
export const setPracticeAndPrescriber = (payload: { practice: IPractice; prescriber: IUser }) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/user/practice/prescriber`,
    method: 'PUT',
    body: { ...payload },
  });

export const deleteUserToken = (userId: number) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/user/token/${userId}`,
    method: 'DELETE',
  });

/**
 * Get the current user from the PLATFORM with additional full details
 * @method scriptsure.services.UserService#getUserDetail
 * @returns {angular.IPromise<User>} Resolves to a {@link User}
 * @public
 */
export const getUserDetailFull = (userId: number) =>
  request<IUserPlatform>({
    url: `${API_URL_PLATFORM}/v1.0/user/detail/${userId}`,
    method: 'GET',
  });

export const getUsers = (organizationId: number, limit?: number, offset?: number) =>
  request<IPrescriber[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/users?limit=${limit ?? 500}&offset=${offset ?? 0}&organizationId=${organizationId}`,
    method: 'GET',
  });

/**
 * Gets a specific Epcs request
 * @param userId - Epcs identification number
 * @param epcsStatus - Epcs Status for the request {@link EpcsStatusEnum}
 * @returns {Promise} - Epcs request entity {@link platform.services.IEpcs}
 */
export const getUserEpcs = (userId: number) =>
  request<IEpcs[]>({
    url: `${API_URL_PLATFORM}/v1.0/user/epcs/requests/${userId}`,
    method: 'GET',
  });

/**
 * Gets a specific Epcs request
 * @param userId - Epcs identification number
 * @param epcsStatus - Epcs Status for the request {@link EpcsStatusEnum}
 * @returns {Promise} - Epcs request entity {@link scriptsure.services.IEpcs}
 */
export const getEpcsRequest = (userId: number, epcsStatus: number) =>
  request<IEpcs>({
    url: `${API_URL_PLATFORM}/v1.0/user/epcs/request/${userId}/${epcsStatus}`,
    method: 'GET',
  });

/**
 * Save or update the epcs
 * @returns {boolean} - Returns True if the epcs request is insert: Returns False when
 * the epcs record is updated
 */
export const saveEpcs = (payload: IEpcs) =>
  request<IEpcs>({
    url: `${API_URL_PLATFORM}/v1.0/user/epcs`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Delete a specific user SPI
 * @public
 */
export const deleteSpi = (spi: string) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/user/spi/${spi}`,
    method: 'DELETE',
  });

/**
 * Update a specific user
 * @method platform.services.UserService#updateUser
 * @returns {angular.IPromise<User>} Resolves to a {@link User}
 * @public
 */
/* Response Model
archived: false
businessUnitId: 425
cellPhone: null
challengeAnswerOne: null
challengeAnswerTwo: null
challengeOneModified: "2022-01-29T09:48:44.779Z"
challengeQuestionOne: "in what city was your high school?"
challengeQuestionTwo: "what is your best friend's first name?"
challengeToken: null
challengeTokenExpires: null
challengeTwoModified: "2022-01-29T09:48:44.779Z"
createdAt: "2022-01-29T08:13:45.000Z"
dea: null
deaInstitute: null
degrees: null
detox: null
directAddress: null
dob: null
email: "sdmi@smartru.com"
emailIdme: null
emailVerificationTimestamp: "2022-01-29T08:13:45.000Z"
emailVerified: true
endDt: "2042-01-29T08:13:45.000Z"
eulaSigned: "2022-01-29T08:13:48.000Z"
experianResult: null
experianTransactionId: null
firstName: "Sergey"
fullName: "Sergey Demin"
id: 3369
inviteId: 39917
inviteLink: null
inviteLinkExpires: null
inviteUserId: 71592
isLocked: false
lastLogin: "2022-01-29T09:46:20.000Z"
lastName: "Demin"
loginImage: null
middleName: null
note: null
npi: null
npiInstitute: null
password: "$2b$10$ikG47QM1CI0n8p86bCS7/.qY82nT/JEg4D.YbGszNgyuCFCyk7wAS"
prescribePassword: null
prescriber: false
pwdResetToken: null
pwdResetTokenExpires: null
recordDateIdme: null
recoveryEmail: null
recoveryPhone: null
recoverySecret: null
retries: 0
salutation: null
secondaryVerified: null
serviceLevel: 0
sessionToken: null
signupToken: null
signupTokenExpires: null
specialtyCode: null
ssn: null
startDt: "2022-01-29T08:13:45.000Z"
stateControlled: null
stateLicense: null
statusText: "Active User"
suffix: null
supervisor: null
timeType: "FT"
timeZone: "US/Eastern"
updatedAt: "2022-01-29T09:48:44.000Z"
useSecondaryAuth: null
userExternalId: null
userId: 3369
userName: "Sergey Demin"
userStatus: 0
userType: "Staff"
uuidIdme: null
workPhone: null
*/
export const updateUser = (user: IUserPlatform) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/admin/user/${user.id}`,
    method: 'PUT',
    body: { ...user },
  });

// Registration \/

/**
 * Deactivates a specific SPI number
 * @method platform.services.RegisterService#deactivateSpi
 * @returns {angular.IPromise<any>}
 */
export const deactivateSpi = (payload: { spi: string }) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/registration/deactivate`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Gets the current status for the array of SPI numbers
 * @returns {IPromise<T>}
 * @param spi
 */
export const electronicStatus = (spi: string) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/registration/prescriber/${spi}`,
    method: 'GET',
  });

// Registration /\
