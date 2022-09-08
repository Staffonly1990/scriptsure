import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';

export interface IUserLogin {
  npi?: string;
  email: string;
  password: string;
  checkEula?: boolean;
}

export const verifyLogin = (payload: IUserLogin) =>
  request<{}>({
    url: `${API_URL_PLATFORM}/v1.0/login`,
    method: 'POST',
    body: { ...payload },
  });

export const refreshUserSession = () =>
  request<{}>({
    url: `${API_URL_PLATFORM}/v1.0/user/refresh/session`,
    method: 'GET',
  });
