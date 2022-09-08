import { API_URL_SCRIPTSURE, API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import type { IAuditLog, IAuditLogType, IAuditLogFilter } from './auditlog.types';

export const createAuditLog = (payload: IAuditLog) =>
  request<IAuditLog>({
    url: `${API_URL_SCRIPTSURE}/v1.0/auditlog`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Removes the table hash from the AuditTableHash table in the event
 * that the hash no longer is representative of the total records
 * based on the integrityDate
 */
export const deleteAuditTableHash = (practiceId: number) =>
  request<IAuditLogType[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/auditlog/tablehash/${practiceId}`,
    method: 'DELETE',
  });

/**
 * Checks to ensure that the audit log has not been tampered with by checking
 * the hash values of current and stored values
 */
export const checkAuditLog = (practiceId: number) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/auditlog/check/${practiceId}`,
    method: 'GET',
  });

/**
 * Get list of audit log types
 */
export const getAuditLogTypes = () =>
  request<IAuditLogType[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/auditlog/auditlogtypes`,
    method: 'GET',
  });

/**
 * Search for audit events based on filter
 * @param filter - Filter parameters for the search
 */
export const searchAuditLog = (payload: IAuditLogFilter) =>
  request<IAuditLog[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/auditlog/filter`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Deletes the log for a specific practice
 * @param practiceId - Practice identification
 */
export const deleteAuditLog = (practiceId: number) =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/auditlog/${practiceId}`,
    method: 'DELETE',
  });
