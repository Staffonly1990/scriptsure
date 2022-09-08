import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IMedline, IMedlineRequest } from './medline.types';

export const getMedlineInformation = (payload: IMedlineRequest) =>
  request<IMedline>({
    url: `${API_URL_SCRIPTSURE}/v1.0/medline/problem`,
    method: 'POST',
    body: { ...payload },
  });
