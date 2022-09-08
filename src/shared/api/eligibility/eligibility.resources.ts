import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IEligibility } from './eligibility.types';

export const createEligibility = (payload: IEligibility) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/eligibility`,
    method: 'POST',
    body: { ...payload },
  });
