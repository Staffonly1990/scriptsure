import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { INote, INotes, IEncounter, IEncounterResult, IAllergy, IPickItem, IAddendum } from './soap.types';
import { ICurrentMedication } from '../drug/drug.types';

export const getAllNotes = (patientId: number) =>
  request<INotes>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/all/${patientId}`,
    method: 'GET',
  });

export const getAddendum = (addendumId: number) =>
  request<IAddendum>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/addendum/${addendumId}`,
    method: 'GET',
  });

export const archiveNote = (soapId: number) =>
  request<IAddendum>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/archive/${soapId}`,
    method: 'PUT',
  });

export const deleteNote = (soapId: number) =>
  request<IAddendum>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/delete/${soapId}`,
    method: 'PUT',
  });

export const getNote = (soapId: number) =>
  request<INote>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/${soapId}`,
    method: 'GET',
  });

/*
  Checks for current checkout (Check Soap Checkout)
  /v1.0/soap/checkout/:soapId 
  {
  "soapId":34,
  "soapType":50,
  "userId":5,
  "userName":"John Healam, M.D.",
  "createdAt":"2016-07-28T16:13:22.000Z',
  "sessionId":123
  },
  "newCheckout": false
*/

export const getNoteСheckout = (soapId: number) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/checkout/${soapId}`,
    method: 'GET',
  });

/*
  Deletes the checkout for the current note (Delete Checkout)
  /v1.0/soap/deleteCheckout/:soapId
  Status: 200 OK
  {
  "msg":"This note is currently checked out by another user",
  "overwritten":true
  }
*/
export const deleteNoteCheckout = (soapId: number, overwrite: boolean) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/deleteCheckout/${soapId}?overwrite=${overwrite}`,
    method: 'PUT',
  });

/*
  saves the new addendum (Create Addendum)
  {post}   /v1.0/soap/newAddendum
  Status: 200 OK
  {
    "parentSoapId":50,
    "patientId":183,
    "userId":1,
    "userName":"John Healam",
    "doctorId":1,
    "doctorName":"John Healam",
    "comment":"This is an addendum comment"
  }
*/

export const createAddendum = (payload: IAddendum) =>
  request<{ addendum: IAddendum; msg: string }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/newAddendum`,
    method: 'POST',
    body: { ...payload },
  });

export const newPickList = (payload: { text: string; title: string; type: string; userId: number }) =>
  request<IPickItem[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/pickList`,
    method: 'POST',
    body: { ...payload },
  });

export const pickList = () =>
  request<IPickItem[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap/pickList`,
    method: 'GET',
  });

export const editNote = (payload: INote, methodV: string) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/soap`,
    method: methodV,
    body: { ...payload },
  });

export const getCurrentEncounter = (patientId: number, createIfNoneExists: boolean) =>
  request<IEncounterResult>({
    url: `${API_URL_SCRIPTSURE}/v1.0/encounter/current/${patientId}/${createIfNoneExists}`,
    method: 'GET',
  });

export const getCurrentMedications = (patientId: number) =>
  request<ICurrentMedication[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/current/${patientId}/0`,
    method: 'GET',
  });

export const getEncounterById = (encounterId: number) =>
  request<IEncounter>({
    url: `${API_URL_SCRIPTSURE}/v1.0/encounter/encounter/${encounterId}`,
    method: 'GET',
  });

export const getPatientAllergies = (patientId: number) =>
  request<IAllergy[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy/patient/${patientId}`,
    method: 'GET',
  });
