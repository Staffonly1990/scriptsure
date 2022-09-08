import { API_URL_SCRIPTSURE } from 'shared/config';
import request from 'shared/api/request';
import { CommentType } from './comment.types';

// getInternalComments - type === 2
// getInsurances - type === 3
// getPharmacyNotes - type === 1

export const getComments = (practiceId: number, type: CommentType) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/comment/${practiceId}/${type}`,
    method: 'GET',
  });
