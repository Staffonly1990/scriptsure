import type { IPractice } from 'shared/api/practice';

export interface IHiddenComponents {
  name?: string;
}

export interface ISetting {
  userID?: number;
  practiceID?: number;
  settingID?: number;
  key?: number;
  name?: string;
  type?: string;
  value?: string | number | boolean;
  defaultValue?: string;
}

export interface IBillingAccountSetting {
  billingAccountID: number;
  settingID: number;
  value: string;
  Setting: ISetting;
}

export interface IPracticeSetting {
  practiceID: number;
  settingID: number;
  value: string;
  Setting: ISetting;
}

export enum SettingTypeEnum {
  USER = 'User',
  DOCTOR = 'Doctor',
  ACCOUNT = 'Account',
  PRACTICE = 'Practice',
  BUSINESSUNIT = 'BusinessUnit',
  ORGANIZATION = 'Organization',
}

// /**
//  * @typedef {object} Setting
//  * @property {number} id
//  * @property {number} applicationID
//  * @property {string} name
//  * @property {string} displayName
//  * @property {string} type
//  */

// /**
//  * @typedef {object} UserSetting
//  * @property {number] userID
//  * @property {number} settingID
//  * @property {string} value
//  * @property {Setting} Setting
//  */

export interface ISettingUnique {
  titleId?: number;
  settingId?: number;
  parentSettingId?: string | number | null;
  orderNumber?: number;
  name?: string;
  key?: string;
  entityType?: number;
  controlType?: number;
  condition?: string | number | null;
  functionCall?: string | null;
  defaultValue?: string;
  selectList?: string | number | null;
  direction?: string | number | null;
  value?: string | number | boolean;
}

export interface ISettingTitle {
  headingId?: number;
  titleId: number;
  orderNumber?: number;
  name?: string;
  direction?: string | number | null;
  Setting?: ISettingUnique[];
}

export interface ISettingHeading {
  sectionId?: number;
  headingId?: number;
  orderNumber?: number;
  name?: string;
  functionCall?: string | number | null;
  SettingTitle: ISettingTitle[];
}

export const conditions = {
  false: '0',
  true: '1',
};

export enum EntityTypeEnum {
  UNASSIGNED = 0,
  PRACTICE = 1,
  USER = 2,
  BILLING = 3,
}

export interface ISettingSection {
  mainId: number;
  sectionId?: number;
  orderNumber: number;
  name: string;
  direction: string;
  functionCall: string | number | null;
  SettingHeading: ISettingHeading[];
}

export interface ISettingAll {
  mainId: number;
  orderNumber?: number;
  name: string;
  entityType: EntityTypeEnum;
  SettingSection: ISettingSection[];
}

export interface IBusinessUnit {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  email: string;
  organizationId: number;
  billingAccountId: number;
  recurlySubscriptionUUID?: string;
  Practices: IPractice[];
  businessunitadmins?: IBusinessUnitAdmin;
  BillingAccount: IBillingAccount;
  // TODO: developer (Demin) - add Organization
  businessUnitExternalId?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  BusinessUnitAdmins?: IBusinessUnitAdmin[];
  // TODO: developer (Demin) - add Organization
}

export interface IBillingAccount {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  email: string;
  recurlySubscriptionUUID?: string;
  accountCode: string;
  accountInfo?: any;
  // TODO: developer (Demin) - add Organization
  OrganizationId?: number;
  createdAt?: string | Date;
  firstName?: string;
  lastCheck?: any;
  lastName?: any;
  organizationId?: number;
  subscriptionMonthly?: any;
  subscriptionYearly?: any;
  updatedAt?: string | Date;
  vendorAccount?: boolean;
  BillingAccountAdmins?: any[];
  // TODO: developer (Demin) - add Organization
}

// TODO: developer (Demin) - add Organization
export interface IBusinessUnitAdmin {
  userId?: number;
  businessunitId?: number;
  createdAt?: string | Date;
  id?: number;
  siteAdministrator?: number | boolean;
  updatedAt?: string | Date;
}

export enum ENamesSetting {
  PracticeSetting = 'Practice Setting',
  UserSetting = 'User Setting',
  ManageUsers = 'Manage Users',
  Billing = 'Billing',
  Miscellaneous = 'Miscellaneous',
  Security = 'Security',
}

export type ENamesSettingType = typeof ENamesSetting[keyof typeof ENamesSetting];

export enum ESettingMainId {
  'Practice Setting' = 1,
  'User Setting' = 2,
  'Manage Users' = 3,
  'Billing' = 4,
  'Miscellaneous' = 5,
  'Security' = 6,
}
