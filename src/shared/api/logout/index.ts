import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';

export const logout = () =>
  request<Nullable<string>>({
    url: `${API_URL_PLATFORM}/v1.0/logout`,
    method: 'GET',
    responseType: 'text' as XMLHttpRequestResponseType,
  });
