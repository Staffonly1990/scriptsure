import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IEducation } from './education.types';

export const getEducation = (patientId: number | string, eduType: string) =>
  request<IEducation>({
    url: `${API_URL_SCRIPTSURE}/v1.0/education/${patientId}/${eduType}`,
    method: 'GET',
  });

export const archiveEducation = (payload: IEducation) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/education/`,
    method: 'PUT',
    body: { ...payload },
  });

export const deleteEducation = (educationId: number) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/education/${educationId}`,
    method: 'DELETE',
  });
