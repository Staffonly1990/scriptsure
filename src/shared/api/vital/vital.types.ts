export interface IPatientVital {
  vitalId?: number | string;
  patientId?: number | string;
  encounterId?: number | string;
  userId?: number | string;
  userName?: string;
  doctorId?: number | string;
  doctorName?: string;
  archive?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVitalGroup {
  dateOfMeasure?: string;
  loinc?: string;
  measurementValue?: string;
  name?: string;
  orderId?: number;
  unitOfMeasure?: string;
  archive?: boolean;
  save: null;
}

export interface IVitals {
  vitalId?: number | string;
  loinc?: string;
  name?: string;
  measurementValue?: string;
  unitOfMeasure?: string;
  archive?: boolean;
  createdAt?: string;
  userName?: string;
  PatientVitalHeader?: IPatientVital[];
  PatientVitalGroup?: IVitalGroup[];
  calculateBmi?: boolean;
  dateOfMeasure?: string;
  order?: number;
  orderId?: number;
  save?: null;
  concatValue?: string;
}
