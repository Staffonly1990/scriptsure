import { API_URL_SCRIPTSURE } from 'shared/config';
import request from '../request';
import { IOrderset } from './orderset.types';

/**
 * Get full list of order sets for organization that is currently selected
 * also ensures that the user has security to see the orderset
 * * @returns {Promise} - List of ordersets
 */
export const getOrdersets = (organizationId: number) =>
  request<IOrderset[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/orderset/${organizationId}`,
    method: 'GET',
  });

/**
 * Get specific orderset
 * @returns {object} - Returns empty object
 */
export const getOrderset = (ordersetId: number) =>
  request<IOrderset>({
    url: `${API_URL_SCRIPTSURE}/v1.0/orderset/detail/process/${ordersetId}`,
    method: 'GET',
  });
