export interface IPatient {
  added?: string;
  addressLine1?: string;
  addressLine1Work?: string;
  addressLine2?: string;
  addressLine2Work?: string;
  alternateEthnicityId?: string;
  alternateRaceId?: string;
  cell?: string;
  chartId?: string;
  patientId?: number | null;
  city?: string;
  cityWork?: string;
  consent?: boolean;
  deathCause?: string;
  deathDate?: string;
  dob?: string;
  doctorId?: number;
  email?: string;
  emergencyContact?: string;
  ethnicityId?: number | string;
  firstName?: string;
  genderIdentity?: string;
  genderIdentityDescription?: string;
  middleName?: string;
  motherFirstName?: string;
  motherLastName?: string;
  gender?: string;
  generalComment?: string;
  generalHealth?: string;
  hippaCompliance?: boolean;
  hippaComplianceDate?: string;
  home?: string;
  languageId?: string;
  lastName?: string;
  maritalStatusId?: string;
  nextOfKinName?: string;
  nextOfKinPatientId?: number;
  nextOfKinPhone?: string;
  patientIdExternal?: number;
  patientStatusId?: number;
  phone1Emergency?: string;
  phone1Work?: string;
  phone2Emergency?: string;
  phone2Work?: string;
  practiceId?: number;
  preferredCommunicationId?: string;
  primaryPhone?: string;
  raceId?: string;
  relationId?: string;
  sexualOrientation?: string;
  sexualOrientationDescription?: string;
  ssn?: number;
  state?: string;
  stateWork?: string;
  suffix?: string;
  updated?: string;
  userAdded?: string;
  userIdAdded?: number;
  userIdUpdated?: number;
  work?: string;
  zip?: string;
  zipWork?: string;
  patientKinRelation?: string;
  encounterId?: number;
}

export interface IPatientAllergy extends IPatient {
  patientStatus?: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  addressLine1: string;
  zip: string;
  city: string;
  state: string;
  home: string;
  patientStatusId: number;
  hippaComplianceDate?: string;
  alternateRaceId: string;
  raceId: string;
  languageId: string;
  updatedAt?: string;
  userUpdated?: string;
  selectedAlternateRace: {
    raceId: string;
    descr: string;
  } | null;
  selectedLanguage: {
    languageId: string;
    descr: string;
  } | null;
  selectedRace: {
    raceId: string;
    descr: string;
  } | null;
  countryCode?: string;
  createdAt?: string;
  deletedAt?: string;
  middleName?: string;
  nextOfKinRelation?: string;
  patientSource?: number;
  removeSearch?: string;
  showDrugHistory?: boolean;
  showEligibility?: boolean;
  showSelectStatus?: string;
  preferredLanguage?: string;
  allergy?: any;
  hicRoot?: number[];
  hicSeqn?: number[];
  damAlrgnGrp?: number[];
  damAlrgnXsense?: number[];
}

export interface IPatientAdvancedQueryPayload {
  firstName?: string;
  lastName?: string;
  chartId?: string;
  ssn?: string;
  zip?: string;
  home?: string;
  patientStatusId?: number | string | null;
  practice?: any;
  dob?: any;
  removeSearch?: boolean;
}

export interface IPatientSearch {
  query: string;
}

export interface IPatientAdvancedSearch {
  advQuery: IPatientAdvancedQueryPayload;
}

export interface IPatientStatus {
  descr: string;
  patientStatusId: number;
}

export interface IPatientEthnicity {
  descr: string;
  ethnicityId: string;
}

export interface IPatientMaritalStatus {
  descr: string;
  maritalStatusId: string;
}

export interface IPatientPreferredCommunicationId {
  descr: string;
  preferredCommunicationId: string;
}

export interface IPatientRelation {
  descr: string;
  relationId: string;
}

export interface IPatientRace {
  descr: string;
  raceId: string;
}

export interface IPatientLanguage {
  descr: string;
  languageId: string;
}

export interface ISavedPatient {
  savedPatientObj: IPatientAllergy;
  successMsg: string;
}

export interface IPatientDuplicate {
  dob: string;
  lastName: string;
  firstName: string;
}

export interface IPatientZIP {
  AreaCode: string;
  City: string;
  CityType: string;
  County: string;
  CountyFIPS: string;
  DST: string;
  Latitude: number;
  Longitude: number;
  State: string;
  StateCode: string;
  TimeZone: string;
  ZIPCode: string;
  ZIPCodeType: string;
}

export interface IPharmacyFilter {
  ncpdpid: string;
  businessName: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax: string;
  specialties: string[];
}

export interface IPharmacy {
  isSelected?: boolean;
  ncpdpId: string;
  storeNumber?: string;
  businessName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  countryCode?: string;
  standardizedAddressLine1?: string;
  standardizedAddressLine2?: string;
  standardizedCity?: string;
  standardizedState?: string;
  standardizedPostal?: string;
  primaryTelephone?: string;
  fax?: string;
  electronicMail?: string;
  alternatePhoneNumbers?: string;
  activeStartDate?: string;
  activeEndDate?: string;
  serviceLevel?: string;
  partnerAccount?: string;
  lastModifiedDate?: string;
  crossStreet?: string;
  recordChange?: string;
  oldServiceLevel?: string;
  version?: string;
  npi?: string;
  directorySpecialtyName?: string;
  replaceNCPDPID?: string;
  stateLicenseNumber?: string;
  upin?: string;
  facilityId?: string;
  medicareNumber?: string;
  medicaidNumber?: string;
  payerId?: string;
  deaNumber?: string;
  hin?: string;
  mutallyDefined?: string;
  directAddress?: string;
  organizationType?: string;
  organizationId?: string;
  parentOrganizationId?: string;
  latitude?: string;
  longitude?: string;
  precise?: string;
  useCases?: string;
  specialties?: string[];
  services?: string[];
  PatientPharmacy: [
    {
      patientId: number;
      ncpdpId: string;
      default: boolean;
      active: boolean;
    }
  ];
}

export enum SortCommonsList {
  BusinessName = 'businessName',
  City = 'city',
  State = 'state',
  ZipCode = 'zip',
}

export type OSortCommonsList = typeof SortCommonsList[keyof typeof SortCommonsList];
