import type { ObservableInput } from 'rxjs';
import { EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IAllergy, IAllergyCreatePayload, IAllergyUpdatePayload, IAllergySearchPayload, IAllergyClassification } from './allergy.types';

export const getAdverseEvents = () =>
  request<object[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy/adverseevents`,
    method: 'GET',
  });

export const getReactions = () =>
  request<object[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy/reactions`,
    method: 'GET',
  });

export const getSeverities = () =>
  request<object[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy/severities`,
    method: 'GET',
  });

export const getPatientAllergies = (payload: number, signal$?: ObservableInput<any>) => {
  const response$ = request<IAllergy[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy/patient/${payload}`,
    method: 'GET',
  }).pipe(takeUntil(signal$ ?? EMPTY));
  return response$;
};

export const addAllergy = (payload: IAllergyCreatePayload) =>
  request<IAllergy>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy`,
    method: 'POST',
    body: { ...payload },
  });

export const updateAllergy = (payload: IAllergyUpdatePayload) =>
  request<IAllergy>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy`,
    method: 'PUT',
    body: { ...payload },
  });

export const allergySearch = (payload: IAllergySearchPayload, createXHR?: any) => {
  const response$ = request<IAllergyClassification[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/allergy/search`,
    method: 'POST',
    body: { ...payload },
    timeout: 30000,
    createXHR,
  });
  return response$;
};

export const getAllergyById = () => undefined; // GET url: `${API_URL_SCRIPTSURE}/v1.0/allergy/${id}`
