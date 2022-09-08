import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IVitals } from './vital.types';

export const getVitals = (patientId: number | string, vitalType: string) =>
  request<IVitals>({
    url: `${API_URL_SCRIPTSURE}/v1.0/vital/${patientId}/${vitalType}`,
    method: 'GET',
  });

export const archiveVitals = (payload: IVitals) =>
  request<IVitals>({
    url: `${API_URL_SCRIPTSURE}/v1.0/vital/`,
    method: 'PUT',
    body: { ...payload },
  });

export const sendVitals = (payload: IVitals) =>
  request<{ results: IVitals }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/vital/`,
    method: 'POST',
    body: { ...payload },
  });
