export interface IDiagnosis {
  long: string;
  codingSystem: number;
  conceptId: string;
  name: string;
  practiceId: number;
}

export interface ISearchDiagnosis extends IDiagnosis {
  isCode: boolean;
  orderNumber: number;
  short: string;
}

export interface ICreateDiagnosis {
  archive: boolean;
  codingSystem: number;
  conceptId: string;
  encounterId?: number;
  isCondition: boolean;
  name: string;
  patientId?: number;
  startDate?: string | Date;
}

export interface ICreateEditDiagnosis extends ICreateDiagnosis {
  endDate?: string | Date;
  chronicId?: string;
  associatedConceptId?: string;
  finalConceptId?: string;
  terminal?: boolean;
  terminalStageId?: string;
  comment?: string;
  associatedCodingSystem?: string;
  finalCodingSystem?: string;
  diagnosisTypeId?: number;
}

export interface ICreateDiagnosisResponse {
  archive: boolean;
  codingSystem: number;
  conceptId: string;
  createdAt: string;
  doctorId: number;
  doctorName: string;
  encounterId: number;
  id: number;
  isCondition: boolean;
  name: string;
  patientId: number;
  snomed: string;
  startDate: string;
  updatedAt: string;
  userId: number;
  userName: string;
}

export interface IPatientEncounter {
  archive: boolean;
  associatedCodingSystem: null | string;
  associatedConceptId: null | string;
  chronicId: null | string;
  codingSystem: number;
  comment: null | string;
  conceptId: string;
  createdAt: string;
  diagnosisTypeId: null | string;
  doctorId: number;
  doctorName: string;
  encounterId: number;
  endDate: null | string;
  finalCodingSystem: null | string;
  finalConceptId: null | string;
  id: number;
  isCondition: boolean;
  name: string;
  patientId: number;
  problemTypeId: null | string;
  snomed: string;
  startDate: string;
  terminal: null | string;
  terminalStageId: null | number;
  updatedAt: string;
  userId: number;
  userName: string;
}
