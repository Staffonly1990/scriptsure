import request from 'shared/api/request';

import { API_URL_SCRIPTSURE, API_URL_PLATFORM } from 'shared/config';
import { IProvider, IPhysicianPayload, IPhysicianMeasure, IHospitalPayload, IDocumentsPayload } from './report.types';

export const getProviders = () =>
  request<IProvider>({
    url: `${API_URL_PLATFORM}/v1.0/providers/`,
    method: 'GET',
  });

export const getPhysicians = (payload: IPhysicianPayload) =>
  request<IPhysicianMeasure>({
    url: `${API_URL_SCRIPTSURE}/v1.0/automatedmeasure/v3/ep`,
    method: 'POST',
    body: { ...payload },
  });

export const getHospitals = (payload: IHospitalPayload) =>
  request<IPhysicianMeasure>({
    url: `${API_URL_SCRIPTSURE}/v1.0/automatedmeasure/v3/eh`,
    method: 'POST',
    body: { ...payload },
  });

export const exportEPMeasure = (variant: string, exportEPData: IPhysicianPayload) =>
  request<object[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/automatedmeasure/export/ep/${variant}`,
    method: 'GET',
    body: { ...exportEPData },
  });

export const getDocumentTypes = () =>
  request<object[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/document/documentTypes`,
    method: 'GET',
  });

export const getDocuments = (payload?: IDocumentsPayload) =>
  request<object[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/document/cached`,
    method: 'POST',
    body: { ...payload },
  });
