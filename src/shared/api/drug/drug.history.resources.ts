import { API_URL_SCRIPTSURE } from 'shared/config';
import { IPrescriptionStatus } from '../prescription';
import request from '../request';
import { IPrescription } from '../soap';
import { ICurrentMedication } from './drug.types';

export const getPrescriptionByMessageId = (messageId: string) =>
  request<IPrescription>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/prescription/message/${messageId}`,
    method: 'GET',
  });

export const updateStatus = (prescriptionStatus: IPrescriptionStatus) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/status`,
    method: 'POST',
    body: { prescriptionStatus },
  });

export const getPrintedPrescription = (prescriptionId: number, user: any) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/printed/${prescriptionId}`,
    method: 'POST',
    body: user,
  });

export const deletePrescription = (prescriptionId: number, deleteNote: string) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/prescription/${prescriptionId}/${encodeURIComponent(deleteNote)}`,
    method: 'DELETE',
  });

export const encryptData = (data: any) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/export/`,
    method: 'POST',
    body: { data },
  });

/**
 * Gets the patient current medications to refresh the cache to allow for future
 * Drug-Drug checks
 * @method scriptsure.services.PatientService#refreshPatientCurrentMedications
 * @param     {IPatient}  payload   The object which contains the property values of the
 * {@link Patient} patient cached in the service.
 * @returns   {angular.IPromise<Patient>}  Resolves to a {@link Patient}.
 * @public
 */
export const refreshPatientCurrentMedications = (patientId: number, ignoreDays: number) =>
  request<ICurrentMedication[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/current/${patientId}/${ignoreDays}`,
    method: 'GET',
  });
