import type { IPatient, IPatientAllergy } from 'shared/api/patient';

export const defaultOptionsGender = [
  { value: 'F', key: 'female' },
  { value: 'M', key: 'male' },
  { value: 'U', key: 'unknown' },
];

export const defaultOptionsState = [
  { value: 'AK', label: 'AK' },
  { value: 'AL', label: 'AL' },
  { value: 'AR', label: 'AR' },
  { value: 'AZ', label: 'AZ' },
  { value: 'CA', label: 'CA' },
  { value: 'CO', label: 'CO' },
  { value: 'CT', label: 'CT' },
  { value: 'DC', label: 'DC' },
  { value: 'DE', label: 'DE' },
  { value: 'FL', label: 'FL' },
  { value: 'GA', label: 'GA' },
  { value: 'HI', label: 'HI' },
  { value: 'IA', label: 'IA' },
  { value: 'ID', label: 'ID' },
  { value: 'IL', label: 'IL' },
  { value: 'IN', label: 'IN' },
  { value: 'KS', label: 'KS' },
  { value: 'KY', label: 'KY' },
  { value: 'LA', label: 'LA' },
  { value: 'MA', label: 'MA' },
  { value: 'MD', label: 'MD' },
  { value: 'ME', label: 'ME' },
  { value: 'MI', label: 'MI' },
  { value: 'MN', label: 'MN' },
  { value: 'MO', label: 'MO' },
  { value: 'MS', label: 'MS' },
  { value: 'MT', label: 'MT' },
  { value: 'NC', label: 'NC' },
  { value: 'ND', label: 'ND' },
  { value: 'NE', label: 'NE' },
  { value: 'NH', label: 'NH' },
  { value: 'NJ', label: 'NJ' },
  { value: 'NM', label: 'NM' },
  { value: 'NY', label: 'NY' },
  { value: 'NV', label: 'NV' },
  { value: 'OH', label: 'OH' },
  { value: 'OK', label: 'OK' },
  { value: 'OR', label: 'OR' },
  { value: 'PA', label: 'PA' },
  { value: 'PR', label: 'PR' },
  { value: 'RI', label: 'RI' },
  { value: 'SC', label: 'SC' },
  { value: 'SD', label: 'SD' },
  { value: 'TN', label: 'TN' },
  { value: 'TX', label: 'TX' },
  { value: 'UT', label: 'UT' },
  { value: 'VA', label: 'VA' },
  { value: 'VT', label: 'VT' },
  { value: 'WA', label: 'WA' },
  { value: 'WI', label: 'WI' },
  { value: 'WV', label: 'WV' },
  { value: 'WY', label: 'WY' },
];

export const triggerValues: Array<keyof IPatient> = [
  'firstName',
  'lastName',
  'dob',
  'gender',
  'addressLine1',
  'zip',
  'city',
  'state',
  'home',
  'cell',
  'work',
  'patientStatusId',
  'hippaComplianceDate',
];

export const defaultData: IPatientAllergy = {
  addressLine1: '',
  city: '',
  dob: '',
  firstName: '',
  gender: '',
  hippaComplianceDate: '',
  home: '',
  lastName: '',
  patientStatusId: 0,
  state: '',
  zip: '',
  addressLine1Work: undefined,
  addressLine2: undefined,
  addressLine2Work: undefined,
  alternateEthnicityId: undefined,
  alternateRaceId: '',
  cell: undefined,
  chartId: undefined,
  cityWork: '',
  consent: undefined,
  countryCode: undefined,
  createdAt: undefined,
  deathCause: undefined,
  deathDate: undefined,
  deletedAt: undefined,
  doctorId: undefined,
  email: undefined,
  emergencyContact: undefined,
  ethnicityId: undefined,
  genderIdentity: undefined,
  genderIdentityDescription: undefined,
  generalComment: undefined,
  generalHealth: undefined,
  hippaCompliance: undefined,
  languageId: '',
  maritalStatusId: undefined,
  middleName: undefined,
  motherFirstName: undefined,
  motherLastName: undefined,
  nextOfKinName: undefined,
  nextOfKinPatientId: undefined,
  nextOfKinPhone: undefined,
  nextOfKinRelation: undefined,
  patientId: 0,
  patientIdExternal: undefined,
  patientSource: undefined,
  phone1Emergency: undefined,
  phone1Work: undefined,
  phone2Emergency: undefined,
  phone2Work: undefined,
  practiceId: undefined,
  preferredCommunicationId: undefined,
  raceId: '',
  relationId: undefined,
  removeSearch: undefined,
  selectedAlternateRace: { descr: '', raceId: '' },
  selectedLanguage: null,
  selectedRace: null,
  sexualOrientation: undefined,
  sexualOrientationDescription: undefined,
  showDrugHistory: true,
  showEligibility: true,
  showSelectStatus: 'Processing Eligibility',
  stateWork: undefined,
  suffix: undefined,
  updatedAt: undefined,
  userAdded: undefined,
  userIdAdded: undefined,
  userIdUpdated: undefined,
  userUpdated: undefined,
  work: undefined,
  zipWork: undefined,
};
