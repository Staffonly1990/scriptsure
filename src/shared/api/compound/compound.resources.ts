import { API_URL_SCRIPTSURE } from 'shared/config';
import request from '../request';
import type { ICompoundObject, ICompound } from './compound.types';

/**
 * Get full list of order sets for organization that is currently selected
 * also ensures that the user has security to see the compound
 * * @returns {Promise} - List of compounds
 */
export const getCompounds = (organizationId: number, requiredDrug: boolean) =>
  request<ICompoundObject[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/compound/${organizationId}/${requiredDrug}`,
    method: 'GET',
  });

/**
 * Get specific order
 * @returns {object} - Returns empty object
 */
export const getCompoundDetail = (compoundId: number) =>
  request<ICompound>({
    url: `${API_URL_SCRIPTSURE}/v1.0/compound/detail/${compoundId}`,
    method: 'GET',
  });
