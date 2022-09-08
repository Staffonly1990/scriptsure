import type { IPracticeUser } from '../user';

export interface IDoctorData {
  degrees: null | string;
  email: string;
  firstName: string;
  fullName: string;
  id: number;
  lastName: string;
  statusText: string;
}

export interface IPractice {
  selected?: boolean;
  serviceLevel?: any;
  id: number;
  practiceStatus: number | string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  contactName: string;
  businessUnitId: number;
  prescribingName: string;
  otherInfo: string;
  footNote: string;
  taxId: string;
  facilityNpi: string;
  createdAt: string;
  updatedAt: Date;
  practiceExternalId: number;
  countryCode?: number;
  prescribers: any[];
  invitePracticeId?: number;
  epcsStatus?: number;
  epcsStatement?: string;
  // TODO: developer (Demin)
  // users?: IUser[];
  PracticeUsers?: IPracticeUser[];
  PracticeUser?: IPracticeUser[];
  isSelected?: boolean;
  // TODO: developer (Demin)
  supervisors?: {
    firstName: string;
    id: number;
    lastName: string;
  }[];
}
