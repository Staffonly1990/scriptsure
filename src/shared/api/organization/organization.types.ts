import { IPractice } from '../practice/practice.types';
import { IBillingAccount, IBusinessUnit } from '../settings';

// TODO: developer (Demin) - add Organization
export interface IOrganization {
  BillingAccounts: IBillingAccount[];
  BusinessUnits: IBusinessUnit[];
  OrganizationAdmins: any[];
  contactInfo?: string;
  contactName?: string;
  createdAt?: string | Date;
  id?: number;
  inviteId?: number;
  inviteOrganizationId?: number;
  name: string;
  noBaa?: any;
  noEmailCommunication?: boolean;
  organizationExternalId?: number;
  organizationStatus?: number;
  updatedAt?: string | Date;
  Practices?: IPractice[];
}

// TODO: developer (Demin) - add Organization
export interface IOrganizationNotify {
  notifyId?: number;
  organizationId?: number;
  url?: string;
  username?: string;
  password?: string;
  serviceLevel?: number;
  contentType: string;
  notifyType: number;
  active: boolean;
  newrx?: boolean;
  rxrenewal?: boolean;
  cancelrx?: boolean;
  rxchange?: boolean;
}
