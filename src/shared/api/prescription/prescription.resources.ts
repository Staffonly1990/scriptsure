import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IPrescription } from './prescription.types';

export const getPrescription = () =>
  request<IPrescription>({
    url: `${API_URL_SCRIPTSURE}/v1.0/electronic/queue/`,
    method: 'GET',
  });

export const updatePrescriptionInhouseStatus = (messageId: string, isApproved: boolean) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/prescription/filled`,
    method: 'PUT',
    body: {
      messageId,
      isApproved,
    },
  });
