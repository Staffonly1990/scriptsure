import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IVitals } from 'shared/api/vital';
import {
  IPatient,
  IPatientEthnicity,
  IPatientMaritalStatus,
  IPatientPreferredCommunicationId,
  IPatientRace,
  IPatientRelation,
  IPatientAdvancedSearch,
  IPatientSearch,
  IPatientStatus,
  IPatientLanguage,
  ISavedPatient,
  IPatientAllergy,
  IPatientDuplicate,
  IPatientZIP,
  IPharmacyFilter,
} from './patient.types';

export const fetchPatient = (patientId: number) =>
  request<IPatient>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/${patientId}/`,
    method: 'GET',
  });

export const searchPatient = (payload: IPatientSearch, offset?: number) =>
  request<{ results: IPatient[] }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/search?offset=${offset ?? 0}`,
    method: 'POST',
    body: payload,
  });

export const mergePatient = (payload: { patientId: number; patientIdChild: number[] }) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/merge`,
    method: 'POST',
    body: payload,
  });

export const advancedSearchPatient = (payload: IPatientAdvancedSearch, offset?: number) =>
  request<{ results: IPatient[] }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/search/advanced?offset=${offset ?? 0}`,
    method: 'POST',
    body: { ...payload },
  });

export const getDemographicsStatus = () =>
  request<IPatientStatus[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/status`,
    method: 'GET',
  });

export const getDemographicsEthnicity = () =>
  request<IPatientEthnicity[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/ethnicity`,
    method: 'GET',
  });

export const getDemographicsMaritalStatus = () =>
  request<IPatientMaritalStatus[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/maritalstatus`,
    method: 'GET',
  });

export const getDemographicsPreferredCommunicationId = () =>
  request<IPatientPreferredCommunicationId[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/preferredcommunication`,
    method: 'GET',
  });

export const getDemographicsRelation = () =>
  request<IPatientRelation[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/relation`,
    method: 'GET',
  });

export const getDemographicsLanguage = (language: string, createXHR?: any) =>
  request<IPatientLanguage[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/language/${language}`,
    method: 'GET',
    timeout: 30000,
    createXHR,
  });

export const getDemographicsRace = (race: string, createXHR?: any) =>
  request<IPatientRace[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/race/${race}`,
    method: 'GET',
    timeout: 30000,
    createXHR,
  });

export const createPatient = (payload: IPatient) =>
  request<ISavedPatient>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/`,
    method: 'POST',
    body: { ...payload },
  });

export const getPatientAllergy = (payload: Nullable<Partial<IPatientAllergy>>) =>
  request<IPatientAllergy>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/allergy`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Gets the patient picture
 * @param patientId - Patient identification number
 */
export const getPatientImage = (patientId: number) =>
  request<Nullable<string>>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/image/${patientId}`,
    method: 'GET',
    responseType: 'text',
  });

/** Store an image for a patient */
export const sendPatientImage = (payload) =>
  request<FormData>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/image/`,
    method: 'POST',
    body: payload,
  });

/**
 * Deletes the patient picture
 * @param patientId - Patient identification number
 */
export const removePatientImage = (patientId) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/image/${patientId}`,
    method: 'DELETE',
  });

export const checkDuplicatePatient = (payload: IPatientDuplicate) =>
  request<IPatientAllergy>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/search/duplicate`,
    method: 'POST',
    body: { ...payload },
  });

export const getPatient = (payload: number) =>
  request<ISavedPatient>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/${payload}`,
    method: 'GET',
  });

export const updatePatient = (payload: IPatientAllergy) =>
  request<ISavedPatient>({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/`,
    method: 'PUT',
    body: { ...payload },
  });

export const getDataByZip = (payload: number) =>
  request<IPatientZIP>({
    url: `${API_URL_SCRIPTSURE}/v1.0/zipcode/${payload}`,
    method: 'GET',
  });

export const getCommon = (practiceId: number) =>
  request<IVitals>({
    url: `${API_URL_SCRIPTSURE}/v1.0/pharmacy/practice/${practiceId}`,
    method: 'GET',
  });

export const setCommon = (practiceId: number, ncpdpIds: string[]) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/pharmacy/practice`,
    method: 'POST',
    body: { practiceId, pharmacies: ncpdpIds },
  });

export const getPreferred = (patientId: number | string) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/pharmacy/${patientId}`,
    method: 'GET',
  });

export const findPharmacy = (pharmacyFilter: IPharmacyFilter) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/pharmacy/search`,
    method: 'POST',
    body: { ...pharmacyFilter },
  });

export const setDefault = (patientId: number, ncpdpId: string) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/pharmacy/default`,
    method: 'PUT',
    body: { patientId, ncpdpId },
  });

export const removePreferred = (patientId: number, ncpdpId: string) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/pharmacy`,
    method: 'PUT',
    body: { patientId, ncpdpId },
  });

export const removeCommon = (practiceId: number, ncpdpId: string) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/pharmacy/${practiceId}/${ncpdpId}`,
    method: 'DELETE',
  });

export const setPreferred = (patientId: number, ncpdpIds: string[]) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/pharmacy`,
    method: 'POST',
    body: { patientId, pharmacies: ncpdpIds },
  });

export const getPharmacy = (ncpdpId: string) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/pharmacy/${ncpdpId}`,
    method: 'GET',
  });

export const getPatientDetail = (patientId: number) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/${patientId}`,
    method: 'GET',
  });
