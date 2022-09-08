import type { ISetting, IBusinessUnit, IBusinessUnitAdmin } from 'shared/api/settings';
import type { IRoleRestriction } from 'shared/api/restrictions';
import type { IPractice } from 'shared/api/practice';
import { IOrganization } from '../organization';

export interface IUser {
  id?: number;
  businessUnitId: number | string;
  organizationId?: number;
  cellPhone?: string;
  createdAt?: string;
  dea?: string;
  deaInstitute?: string;
  detox?: string;
  directAddress?: string;
  dob?: Date;
  email?: string;
  emailVerificationTimestamp?: Date;
  emailVerified?: boolean;
  endDt: string | Date;
  firstName?: string;
  isLocked: number;
  isSelected?: boolean;
  lastName?: string;
  lastLogin?: string;
  middleName?: string;
  fullName?: string;
  note?: string;
  npi?: string;
  npiInstitute?: string;
  password?: string;
  Practices?: IPractice[];
  UserSpi?: IUserSpi[];
  PracticeUsers?: IPracticeUser[];
  PrescribeFors?: IPrescribeFor[];
  prescribePassword?: string;
  Prescribers?: IPrescriber[];
  pwdResetToken?: string;
  pwdResetTokenExpires?: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  restrictions?: any;
  salt?: string;
  salutation: string;
  secondaryVerified?: number;
  serviceLevel: number;
  sessionToken?: string;
  signupToken?: string;
  signupTokenExpires?: string;
  specialtyCode: string;
  ssn?: string;
  startDt: string | Date;
  stateLicense?: string;
  suffix?: string;
  supervisor?: boolean;
  timeType: string;
  timeZone: string;
  degrees?: string;
  updatedAt?: string;
  userStatus: number | string;
  archived?: number;
  userType: string;
  useSecondaryAuth?: number;
  statusText?: string;
  workPhone?: string;
  challengeQuestionOne?: string;
  challengeQuestionTwo?: string;
  organizations?: IOrganization[];
  Applications?: IApplication[];
  ApplicationsUsers?: IApplicationUser[];
  businessunitadmins?: IBusinessUnitAdmin;

  UserSignupPractices?: IUserSignupPractices[];
  UserSignupApplications?: IUserSignupApplications[];
  saveOnly?: boolean;
  prescriber: boolean;
  experianResult?: string;
  experianTransactionId?: string;
  isBusinessUnitAdmin: number;
}

// TODO: developer (Demin) - add UserPlatform
export interface IUserPlatform extends IUser {
  OrganizationAdmins?: any[];
  challengeAnswerOne?: string;
  challengeAnswerTwo?: string;
  eulaSigned: string | Date;
  loginImage: unknown;
  retries: number;
  stateControlled: unknown;
  statusText: string;
  userExternalId: unknown;
  vendorsOrganizations: IVendorsOrganization[];
  inviteId?: number;
  inviteUserId?: number;
  PrescribeUsing?: IPrescribeUsing[];
  BusinessUnitAdmins?: IBusinessUnitAdmin | null;
  emailConfirm?: string;
  inactivateUser: boolean;
  siteAdministrator: number;
}

export interface IPrescribeUsing {
  userID: number;
  prescriberID: number;
  accessStatus: number;
}

// TODO: developer (Demin) - add UserPlatform
export interface IVendorsOrganization {
  organizationId?: number;
  vendorId?: number;
  UserVendor?: IUserVendor;
}

// TODO: developer (Demin) - add UserPlatform
export interface IUserVendor {
  UserId?: number;
  userId?: number;
  vendorId?: number;
}

export interface IPrescriber extends IUser {
  defaultDoctor?: boolean | null;
  PrescribeFor: IPrescribeFor;
  accessStatus?: number;
}

export interface ITaxonomy {
  classification?: string;
  code: string;
  specialization?: string;
  type?: string;
}

export interface IUserSpi {
  practiceId?: number;
  spi?: string;
  userID?: number;
  userId?: number;
}

export interface IPrescribe {
  fullName: string;
  statusText: string;
  challengeQuestionOne: string;
  challengeAnswerOne: string;
  challengeQuestionTwo: string;
  challengeAnswerTwo: string;
  id: number;
  inviteId: number;
  inviteUserId: number;
  userExternalId: unknown;
  firstName: string;
  middleName: unknown;
  lastName: string;
  dob: unknown;
  ssn: unknown;
  suffix: unknown;
  salutation: unknown;
  cellPhone: unknown;
  workPhone: unknown;
  specialtyCode: unknown;
  timeType: string;
  dea: string;
  npi: string;
  detox: string;
  stateLicense: unknown;
  stateControlled: unknown;
  deaInstitute: unknown;
  npiInstitute: unknown;
  directAddress: unknown;
  degrees: unknown;
  archived: false;
  note: unknown;
  serviceLevel: string;
  userStatus: number;
  email: string;
  password: string;
  prescribePassword: unknown;
  userType: string;
  businessUnitId: number;
  emailVerified: true;
  emailVerificationTimestamp: Date;
  secondaryVerified: unknown;
  useSecondaryAuth: unknown;
  loginImage: unknown;
  startDt: Date;
  endDt: Date;
  retries: number;
  isLocked: false;
  timeZone: string;
  sessionToken: unknown;
  recoveryEmail: unknown;
  recoveryPhone: unknown;
  pwdResetToken: unknown;
  pwdResetTokenExpires: unknown;
  inviteLink: unknown;
  inviteLinkExpires: unknown;
  signupToken: string;
  signupTokenExpires: Date;
  challengeOneModified: Date;
  challengeTwoModified: Date;
  challengeToken: unknown;
  challengeTokenExpires: unknown;
  supervisor: true;
  prescriber: true;
  recoverySecret: unknown;
  lastLogin: Date;
  experianTransactionId: string;
  experianResult: string;
  uuidIdme: string;
  emailIdme: string;
  recordDateIdme: Date;
  eulaSigned: Date | string;
  userId: number;
  userName: string;
  createdAt: Date | string;
  updatedAt: Date;
  PracticeUser: {
    practiceID: number;
    userID: number;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
  };
}

export interface IUserSignup {
  businessUnitId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  salutation?: string;
  suffix?: string;
  UserSignupPractices?: IUserSignupPractices[];
  UserSignupApplications?: IUserSignupApplications[];
}

export interface IUserSignupApplications {
  userId?: number;
  applicationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserSignupPractices {
  userId?: number;
  practiceId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEpcs {
  practiceId: number;
  status: number;
  userId: number;
  userName: string;
  validateMethod: number;

  User?: IUser;
  createdAt?: string | Date;
  id?: number;
  reviewedUserId?: number;
  reviewedUserName?: string;
  updatedAt?: string | Date;
}

export interface IPrescribeFor {
  id?: number;
  userID: number;
  prescriberID: number;
  practiceID?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  User?: IUser;
  accessStatus: number;
  // TODO: developer (Demin) - add UserPlatform
  lastName?: string;
  firstName?: string;
  degrees?: string;
  npi?: string;
  userType?: string;
  PrescribeFor: IPrescribeFor;
  // TODO: developer (Demin) - add UserPlatform
}

export interface IPracticeUser {
  practiceID: number;
  userID: number;
  createdAt?: string;
  updatedAt?: string;
  user?: IUser;
}

export interface IApplication {
  id?: number;
  name?: string;
  vendorID?: number;
  integrationType?: string;
  usersecurity?: boolean;
  url?: string;
  apiKey?: string;
  isSelected?: boolean;
  applicationsusers?: IApplicationsuser;
  createdAt?: string | Date;
  scope?: string;
  updatedAt?: string | Date;
  usesecurity?: boolean;
}

export interface IApplicationUser {
  applicationID?: number;
  userID?: number;
}

export interface IApplicationsuser {
  ApplicationId: number;
  createdAt: string | Date;
  fullName: string;
  statusText: string;
  updatedAt: string | Date;
  userID: number;
}

export interface IUserData {
  Applications?: IApplication[];
  authToken?: boolean;
  businessunits?: IBusinessUnit[];
  currentBusinessUnit?: IBusinessUnit;
  currentOrganization?: IOrganization;
  currentPractice?: IPractice;
  currentPrescriber?: any;
  epcs?: any[];
  organizations?: any[];
  practices?: IPractice[];
  restrictions?: IRoleRestriction[];
  settings?: ISetting[];
  user: IUser;
}

export interface IFilter {
  cellPhone?: string;
  dea?: string;
  firstName?: string;
  lastName?: string;
  npi?: string;
  npiOnly?: boolean;
  userType?: string;
}
