import type { IUser } from 'shared/api/user';

export interface IUserRole {
  userID: number;
  roleID: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRole {
  id?: number;
  name: string;
  practiceID?: number;
  organizationId?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  Restrictions?: IRestriction[];
  Users?: IUser[];
  RoleRestrictions?: IRoleRestriction[];
}

export interface IRestriction {
  isSelected: boolean;
  id: number;
  restrictionGroupID: any;
  name: string;
  description: string;
  translationKey: string;
  identifier: string;
  createdAt?: Date;
  updatedAt?: Date;
  RoleRestriction?: IRoleRestriction[];
}

export interface IRestrictionGroup {
  id: number;
  applicationID: any;
  name: string;
  description: string;
  translationKey: string;
  createdAt?: Date;
  updatedAt?: Date;
  Restriction?: IRestriction[];
}

export interface IRoleRestriction {
  practiceID?: number;
  organizationId?: number;
  restrictionID?: number;
  restrictionId?: number;
  roleID: any;
  name?: string;
  identifier?: any;
}
