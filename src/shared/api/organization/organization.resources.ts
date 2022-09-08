import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import { IOrganization } from './organization.types';

// TODO: developer (Demin) - add Organization
export const getOrganization = () =>
  request<IOrganization>({
    url: `${API_URL_PLATFORM}/v1.0/organization/detail`,
    method: 'GET',
  });
