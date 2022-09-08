import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { ICancelPrescriptionPayload, IFilter, IMessageApprove, IQuery } from './message.types';
import moment from 'moment';

export const fetchMessage = (payload: IQuery) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/filter`,
    method: 'POST',
    body: { ...payload },
  });

export const fetchCount = (payload: IFilter) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/count`,
    method: 'POST',
    body: { ...payload },
  });

export const getMessageHistoryByRequestId = (requestId: number, messageId: string) =>
  request<IMessageApprove[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/messagehistory/${requestId}/${messageId}`,
    method: 'GET',
  });

export const getMessageById = (messageId: string) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/json/${messageId}`,
    method: 'GET',
  });

export const getQuantityQualifiers = () =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/prescription/quantityqualifier`,
    method: 'GET',
  });

export const getMessageDetail = (messageId: string | null) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/detail/${messageId}`,
    method: 'GET',
  });

export const getMessageJson = (messageId: string) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/json/response/${messageId}`,
    method: 'GET',
  });

export const fetchUpdateMessageStatus = (requestId: number, messageStatus: string) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/status`,
    method: 'PUT',
    body: {
      requestId,
      messageStatus,
    },
  });

export const updateMessagePendingStatus = (messageId: string, messageStatus: string) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/pending/`,
    method: 'PUT',
    body: { messageId, messageStatus, approveDate: moment().toDate() },
  });

export const updateMessagePatient = (requestId: number, patientId: number, firstName: string, lastName: string) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/patient`,
    method: 'PUT',
    body: {
      requestId,
      patientId,
      firstName,
      lastName,
    },
  });

export const getMessageResponse = (requestId: number) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/response/${requestId}`,
    method: 'GET',
  });

export const cancelPrescription = (cancelrx: ICancelPrescriptionPayload) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/electronic/cancel/`,
    method: 'POST',
    body: cancelrx,
  });

export const setReviewed = (requestId, reviewed) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/reviewed/${requestId}`,
    method: 'PUT',
    body: reviewed,
  });

export const deletePrescription = (messageId: string) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drughistory/prescription/message/${messageId}`,
    method: 'DELETE',
  });

export const fetchRespondChangeRequest = (changeresponse: any) =>
  request<{}>({
    url: `${API_URL_SCRIPTSURE}/v1.0/electronic/approve/`,
    method: 'POST',
    body: changeresponse,
  });

export const getMessageHistoryByRequestIdString = (requestId: number) =>
  request<IMessageApprove[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/message/messagehistory/detail/all/${requestId}`,
    method: 'GET',
  });
