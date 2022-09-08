import { IPatient } from '../patient';

export interface IPickItem {
  createdAt?: Date | string;
  doctorId?: number;
  doctorName?: string;
  id?: number;
  text?: string;
  title?: string;
  type?: string;
  updatedAt?: string | Date;
  userId?: number;
  userName?: string;
}

export interface IAddendum {
  addendumId?: number;
  comment?: string;
  createdAt?: Date | string;
  doctorId?: number;
  doctorName?: string;
  parentSoapId?: number;
  patientId?: number | null;
  userId?: number;
  userName?: string;
}

export interface INotes {
  addendums: IAddendum[];
  notes: INote[];
}

export interface INote {
  archive?: number | null;
  assessment?: string;
  chiefComplaint?: string;
  createdAt?: string;
  doctorId?: number;
  doctorName?: string;
  encounterId?: number | null;
  html?: string;
  json?: {
    orders?: string[];
    allergies?: string[];
    currentMedications?: string[];
  };
  objective?: string;
  parentSoapId?: number | null;
  patientId?: number | null;
  practiceId?: number;
  signStatus?: number | null;
  soapId?: number | null;
  subjective?: string;
  title?: string;
  treatmentPlan?: string;
  userId?: number;
  userName?: string;
}

export interface IEncounterResult {
  successMsg: string;
  savedEncounterObj: IEncounter;
}

/**
 * ICreateEncounterPayload is for creating a new encounter
 */
export interface ICreateEncounterPayload {
  patientId?: number;
  practiceId?: number;
  userId?: number;
  userName?: string;
  doctorId?: number;
  doctorName?: string;
  encounterStatus?: string;
}

/**
 * IUpdateEncounterPayload is for updating a new encounter
 */
export interface IUpdateEncounterPayload extends ICreateEncounterPayload {
  encounterId: number;
}

/**
 * IEncounter contains all the information of an Encounter
 */
export interface IEncounter extends ICreateEncounterPayload {
  isCurrent?: boolean;
  isExpanded?: boolean;
  encounterId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Prescriptions?: IPrescription[];
  Diagnoses?: IDiagnosis[];
  Soap?: ISoapNote;
  Allergies?: IAllergy[];
  Education?: IEducation[];
}

export interface IDiagnosis {
  id?: number;
  patientId?: number;
  encounterId?: number;
  conceptId: string;
  codingSystem: number | string;
  associatedConceptId?: string;
  associatedCodingSystem?: string;
  name?: string;
  isCondition?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  chronicId?: number;
  problemTypeId?: number;
  terminal?: number;
  terminalStageId?: number;
  diagnosisTypeId?: number;
  finalConceptId?: string;
  finalCodingSystem?: string;
  comment?: string;
  archive?: boolean;
  createdAt?: Date | string;
}

export interface ISoapNote {
  soapId?: number;
  parentSoapId?: number;
  patientId?: number;
  encounterId?: number;
  practiceId?: number;
  userId?: number;
  userName?: string;
  title?: string;
  doctorId?: number;
  doctorName?: string;
  signStatus?: number;
  chiefComplaint?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  treatmentPlan?: string;
  json?: any;
  html?: string;
  archive?: number;
  createdAt?: any;
}

export interface IAllergy {
  id?: string | number;
  patientId?: string | number;
  name?: string;
  encounterId?: string | number;
  HIC_SEQN?: string | number;
  DAM_ALRGN_GRP?: string | number;
  GCN_SEQN?: string;
  rxnorm?: string;
  ndc?: string;
  allergyType?: string | number;
  reactionId?: string | number;
  severityCode?: string;
  adverseEventCode?: string;
  comment?: string;
  onsetDate?: Date;
  endDate?: Date;
  archive?: string | number;
  userId?: string | number;
  userName?: string;
  doctorId?: string | number;
  doctorName?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IEducation {
  educationId?: number;
  name?: string;
  internalComment?: string;
  patientId?: number;
  encounterId?: number;
  conceptId?: string;
  codingSystem?: number;
  languageId?: string;
  visitDate?: Date;
  practiceId?: number;
  userId?: number;
  userName?: string;
  doctorId?: number;
  doctorName?: string;
  archive?: number;
  documentComment?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrescription {
  prescriptionId?: number;
  Patient?: IPatient;
  patientId: number;
  encounterId: number;
  messageId: string;
  practiceId: number;
  userId: number;
  userName: string;
  doctorId: number;
  doctorName: string;
  refill: number;
  writtenDate: string | Date;
  fillDate: string | Date;
  duration: number;
  durationQualifier: string;
  combinationMed: boolean;
  printDuration: number;
  concurrentMed: number;
  archive: string | boolean;
  sendMethod: number;
  pharmacyId: number;
  pharmacy: string;
  prescriptionType: number;
  prescriptionStatusTypeId: number;
  groupId: string;
  pharmacyNote: string;
  authorizationQualifier: string;
  authorizationId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  epacolor?: string;
  epaicon?: string;
  epastatus?: string;
  Pharmacy?: any;
  PrescriptionDrugs?: IPrescriptionDrug[];
  PrescriptionScript?: { drugFormat: string };
  PrescriptionAlerts?: any[];
  PrescriptionComments?: any[];
  PrescriptionDiagnoses?: any[];
  PrescriptionStatuses?: any[];
  PrescriptionStatusAction?: any[];
  Task?: any[];
}

export interface IPrescriptionDrug {
  prescriptionId?: number;
  drugId?: number;
  drugOrder?: number;
  Ndc?: string;
  RxNorm?: string;
  ROUTED_MED_ID?: number;
  GCN_SEQNO?: number;
  drugName?: string;
  epn?: string;
  quantity?: number;
  quantityQualifier?: string;
  calculate?: number;
  sampleLotNumber?: string;
  sampleExpiration?: Date;
  useSubstitution?: boolean;
  drugDuration?: string | Date;
  drugDurationPadded?: Date;
  line1?: string;
  line2?: string;
  fStatus?: string;
  formulary?: any;
  reconcileDate?: string | Date;
  reconcileStatus?: string;
  reconcileUserId?: number;
  isCurrent?: boolean;
  isActive?: boolean;
  isExpired?: boolean;
  color?: string;
  PrescriptionSigs?: any[];
  Prescription?: IPrescription;
  PrescriptionScript?: any;
  PrescriptionAlerts?: any[];
  PrescriptionComments?: any[];
  PrescriptionDiagnoses?: any[];
  PrescriptionStatuses?: any[];
  /**
   * Note has the appearance of an array, but really it is just one if it exists.
   */
  PrescriptionDrugComment?: any;
}
