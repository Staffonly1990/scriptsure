export interface IProviderPractices {
  id?: number;
  invitePracticeId?: number;
  practiceExternalId?: number;
  practiceStatus?: number;
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  countryCode?: string;
  phone?: string;
  fax?: string;
  contactName?: string;
  businessUnitId?: number;
  prescribingName?: string;
  otherInfo?: string;
  footNote?: string;
  taxId?: string;
  facilityNpi?: string;
  createdAt?: string;
  updatedAt?: string;
  practicesers?: {
    createdAt?: string;
    updatedAt?: string;
    practiceID?: number;
    userID?: number;
  };
}

export interface IProvider {
  fullName?: string;
  statusText?: string;
  id?: number;
  firstName?: string;
  lastName?: string;
  salutation?: null;
  suffix?: null;
  Practices?: IProviderPractices[];
}

export interface IPhysicianPayload {
  doctorId?: number | string;
  practiceId?: number | string | any;
  startDate?: any;
  endDate?: any;
}
export interface IHospitalPayload {
  doctorId?: number | string;
  practiceId?: number | string | any;
  startDate?: any;
  endDate?: any;
}
export interface IPhysicianMeasure {
  objective?: string;
  goal?: number;
  numerator?: number;
  denominator?: number;
  percentage?: number;
  status?: string;
  title?: string;
  measureType?: string | number;
  description?: string;
  information?: string;
  patients?: number;
  stage?: string;
}
export interface IHospitalMeasure {
  objective?: string;
  goal?: number;
  numerator?: number;
  denominator?: number;
  percentage?: number;
  status?: string;
  title?: string;
  measureType?: string | number;
  description?: string;
  information?: string;
  patients?: number;
  stage?: string;
}

export interface IAuditLogUsers {
  dea?: string;
  degrees?: string;
  firstName?: string;
  id?: number;
  lastName?: string;
  npi?: string;
  userType?: string;
}

export interface IDocumentsPayload {
  documentType?: string;
  lastDocumentId?: number | string;
  practiceId?: number | string;
  startDate?: any;
  endDate?: any;
  userId?: number | string;
  doctorId?: number | string;
}

export interface IDocumentTypes {
  documentType?: number | string;
  name?: string;
}
