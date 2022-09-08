import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';

export const getPreferredCommunications = () =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/preferredcommunication`,
    method: 'GET',
  });

export const getEthnicity = () =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/ethnicity`,
    method: 'GET',
  });

export const getMaritalStatuses = () =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/maritalstatus`,
    method: 'GET',
  });

export const getStatus = () =>
  request({
    url: `${API_URL_SCRIPTSURE}/v1.0/patient/demographics/status`,
    method: 'GET',
  });
