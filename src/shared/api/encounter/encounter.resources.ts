import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { IEncounterCurrent } from './encounter.types';

export const getEncounterCurrent = (patientId: number, doCreate: boolean) =>
  request<IEncounterCurrent>({
    url: `${API_URL_SCRIPTSURE}/v1.0/encounter/current/${patientId}/${doCreate}`,
    method: 'GET',
  });

export const getAllEncounters = (patientId: number | string) =>
  request<IEncounterCurrent[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/encounter/${patientId}`,
    method: 'GET',
  });
