import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import type { IUserRole, IRole, IRoleRestriction, IRestrictionGroup } from './restrictions.types';

/** Adds or updates the name of a role */
export const addRole = <T = IRole>(payload: Partial<IRole>) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/v1.0/restrictions/role`,
    method: 'POST',
    body: { ...payload },
  });

/** Deletes the role */
export const deleteRole = <T = IRole>(payload: Partial<IRole>) => {
  const { id, organizationId } = payload;
  return request<T[]>({
    url: `${API_URL_PLATFORM}/v1.0/restrictions/role/${id}/${organizationId}`,
    method: 'DELETE',
  });
};

/** Get all the roles that are associated with the current practice selected */
export const getRoles = <T = IRole>(organizationId: number) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/restrictions/role/${organizationId}`,
    method: 'GET',
  });

/** Get all the roles with teh associated users from the organization */
export const getRolesUsers = <T = IRole>(organizationId: number) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/v1.0/restrictions/roles/users/${organizationId}`,
    method: 'GET',
  });

/** Get all the users assigned to a role */
export const getUserRoles = <T = IUserRole>(roleId: number) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/restrictions/userrole/${roleId}`,
    method: 'GET',
  });

/** Gets all the user restrictions for a specific userId */
export const getUserRestrictions = <T = IRestrictionGroup>(userId: number) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/v1.0/restrictions/rolerestriction/user/${userId}`,
    method: 'GET',
  });

/** Gets all the emergency access restrictions for a specific practiceId */
export const getEmergencyAccessRestrictions = <T = IRestrictionGroup>(practiceId: number) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/restrictions/emergencyaccess/${practiceId}`,
    method: 'GET',
  });

/**
 * Gets all the restrictions for a specific applicationId and any any associated
 * roleRestrictions for the specific practiceId if they exist
 */
export const getRestrictions = <T = IRestrictionGroup>(roleId: number) =>
  request<T[]>({
    url: `${API_URL_PLATFORM}/v1.0/restrictions/rolerestriction/${roleId}`,
    method: 'GET',
  });

/** Saves all the security settings for the role to the PLATFORM */
export const saveRestriction = <T = IRestrictionGroup>(payload: { roleId: number; userRoles: IUserRole[]; roleRestrictions: IRoleRestriction[] }) => {
  const { roleId, userRoles, roleRestrictions } = payload;
  return request<T[]>({
    url: `${API_URL_PLATFORM}/v1.0/restrictions/rolerestrictions/${roleId}`,
    method: 'POST',
    body: { userRoles, roleRestrictions },
  });
};
