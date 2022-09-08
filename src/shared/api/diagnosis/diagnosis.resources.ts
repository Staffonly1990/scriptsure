import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IDiagnosis, ICreateDiagnosis, ICreateDiagnosisResponse, IPatientEncounter, ISearchDiagnosis } from './diagnosis.types';

export const getDiagnosisCommon = () =>
  request<IDiagnosis[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/common`,
    method: 'GET',
  });

export const createDiagnosis = (payload: ICreateDiagnosis) =>
  request<ICreateDiagnosisResponse>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis`,
    method: 'POST',
    body: { ...payload },
  });

export const updateDiagnosis = (payload: ICreateDiagnosis) =>
  request<ICreateDiagnosisResponse>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis`,
    method: 'PUT',
    body: { ...payload },
  });

export const getDiagnosisHistory = (patientId: number, encounterId?: number) =>
  request<IDiagnosis[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/history/${encounterId ? `${patientId}/${encounterId}` : `${patientId}`}`,
    method: 'GET',
  });

export const getDiagnosisEncounter = (patientId: number, encounterId: number) =>
  request<IPatientEncounter[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/encounter/${patientId}/${encounterId}`,
    method: 'GET',
  });

export const searchIcd10Diagnosis = (search: string, isGroups: boolean, isCodes: boolean, limit: number) =>
  request<ISearchDiagnosis[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/search/icd10/${search}?sig=${isGroups}&sic=${isCodes}&limit=${limit}`,
    method: 'GET',
  });

export const searchIcd9Diagnosis = (search: string, limit: number) =>
  request<ISearchDiagnosis[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/search/icd9/${search}?limit=${limit}`,
    method: 'GET',
  });

export const searchSnomedDiagnosis = (search: string, limit: number, offset: number) =>
  request<ISearchDiagnosis[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/search/snomed/${search}?limit=${limit}&offset=${offset}`,
    method: 'GET',
  });

export const archiveDiagnosis = (diagnosisId: number) =>
  request<{ affectedCount: number }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/archive`,
    method: 'PUT',
    body: { id: diagnosisId },
  });

export const deleteDiagnosis = (patientId: number, encounterId: number, conceptId: string, codingSystem: number) =>
  request<IPatientEncounter[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/diagnosis/${encounterId}/${patientId}/${conceptId}/${codingSystem}`,
    method: 'DELETE',
  });
