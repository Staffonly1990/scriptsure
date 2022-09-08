import { API_URL_PLATFORM } from 'shared/config';
import request from 'shared/api/request';
import { IPractice } from 'shared/api/practice';

export interface IInviteUser {
  inviteUserId?: number;
  inviteOrganizationId?: number;
  signupToken?: string;
  signupTokenExpires?: Date;
  isBusinessUnitAdmin?: boolean;
  siteAdministrator?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  salutation?: string;
  email?: string;
  prescriber?: boolean;
  userStatus?: number;
  emailVerified?: boolean;
  emailVerificationTimestamp?: Date;
  InviteUserPractice?: IInviteUserPractice[];
  // InvitePrescribeFor?: IInviteUserPrescribeFor[];
  InviteUserPrescribeFor?: IInviteUserPrescribeFor[];
  businessUnitId?: number;
  inviteId?: number;
  organizationId?: number;
  // Ensures that an invite email is sent to new user
  sendInvite: boolean;
}

export interface IInviteUserPrescribeFor {
  inviteUserId?: number;
  prescriberId?: number;
  prescriberIdFor?: number;
  userCreated?: number;
  name?: string;
}

export interface IInviteUserPractice {
  inviteUserId?: number;
  practiceId?: number;
  name?: string;
  /** @deprecated */
  practiceCreated?: boolean;
}

export interface IUserInvite {
  id?: number;
  firstName?: string;
  fullName: string;
  inviteUserId?: number;
  lastName?: string;
  prescriber?: boolean;
  statusText?: string;
  suffix?: string | null;
  userCreated?: number;
}

export const userSearchIncludeInvite = (
  inviteId: number,
  inviteOrganizationId: number,
  organizationId: number,
  prescriber: boolean,
  limit?: number,
  offset?: number
) =>
  request<IUserInvite[]>({
    url:
      `${API_URL_PLATFORM}/v2.0/invite/prescriber/search/${inviteId}/${inviteOrganizationId}/` +
      `${organizationId}?limit=${limit ?? 500}&offset=${offset ?? 0}&prescriber=${prescriber}`,
    method: 'GET',
  });

export const fetchPractices = () =>
  request<IPractice[]>({
    url: `${API_URL_PLATFORM}/v1.0/practice/practices`,
    method: 'GET',
  });

export const checkEmail = (email: string) =>
  request({
    url: `${API_URL_PLATFORM}/v1.0/user/check/${email}`,
    method: 'GET',
  });

export const addInviteUser = (payload: IInviteUser) =>
  request({
    url: `${API_URL_PLATFORM}/v2.0/invite/user`,
    method: 'POST',
    body: { ...payload },
  });

export const resendInvite = (payload) =>
  request({
    url: `${API_URL_PLATFORM}/v2.0/user/resend/invite`,
    method: 'POST',
    body: { ...payload },
  });
