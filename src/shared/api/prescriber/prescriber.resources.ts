import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import { IAccessRequest } from './prescriber.types';

/**
 * Save or update the access request
 * @returns {boolean} - Returns True if the access request is insert: Returns False when
 * the access request record is updated
 */
export const saveAccessRequest = (payload: IAccessRequest) =>
  request<boolean>({
    url: `${API_URL_PLATFORM}/v1.0/accessrequest/user/request`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Gets a specific AccessRequest request
 * @param userId - AccessRequest identification number
 * @param prescriberId - prescriber identification number
 */
export const getAccessRequest = (userId: number, prescriberId: number) =>
  request<boolean>({
    url: `${API_URL_PLATFORM}/v1.0/accessrequest/user/request/pending/${userId}/${prescriberId}`,
    method: 'GET',
  });

export const deleteAccessRequest = (userId: number, prescriberId: number) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/accessrequest/user/request/${userId}/${prescriberId}`,
    method: 'DELETE',
  });
