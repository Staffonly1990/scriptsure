import { IPatient, IPharmacy } from '../patient';
import { ITask } from '../task/task.types';

export interface IPrescriptionMessages {
  requestId: number;
  drugName: string;
  instruction: string;
  pharmacy: string;
  note?: string;
}

export interface IPrescription {
  name?: string;
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
  Pharmacy?: IPharmacy;
  Message?: IPrescriptionMessages;
  messages: IPrescriptionMessages[];
  PrescriptionDrugs?: IPrescriptionDrug[];
  PrescriptionScript?: IPrescriptionScript;
  PrescriptionAlerts?: IPrescriptionAlert[];
  PrescriptionComments?: IPrescriptionComment[];
  PrescriptionDiagnoses?: IPrescriptionDiagnosis[];
  PrescriptionStatuses?: IPrescriptionStatus[];
  PrescriptionStatusAction?: IPrescriptionStatusAction[];
  Task?: ITask[];
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
  PrescriptionSigs?: IPrescriptionSig[];
  Prescription?: IPrescription;
  PrescriptionScript?: IPrescriptionScript;
  PrescriptionAlerts?: IPrescriptionAlert[];
  PrescriptionComments?: IPrescriptionComment[];
  PrescriptionDiagnoses?: IPrescriptionDiagnosis[];
  PrescriptionStatuses?: IPrescriptionStatus[];
  /**
   * Note has the appearance of an array, but really it is just one if it exists.
   */
  PrescriptionDrugComment?: IPrescriptionComment;
}

export interface IPrescriptionSig {
  drugId?: number;
  sigId?: number;
  sigOrder: number;
  line3: string;
  sigFreeText: string;
  multipleSigModifier: string;
  doseDeliveryMethodCode: string;
  doseDeliveryMethodText: string;
  doseQuantity: number;
  doseFormCode: string;
  doseFormText: string;
  routeofAdministrationCode: string;
  routeofAdministrationText: string;
  siteofAdministrationCode: string;
  siteofAdministrationText: string;
  administrationTimingCode: string;
  administrationTimingText: string;
  secondaryAdministrationTimingCode: string;
  secondaryAdministrationTimingText: string;
  secondaryAdministrationTimingModifierCode: string;
  secondaryAdministrationTimingModifierText: string;
  frequencyNumericValue: number;
  frequencyUnitsCode: string;
  frequencyUnitsText: string;
  intervalNumericValue: number;
  intervalUnitsText: string;
  intervalUnitsCode: string;
  indicationPrecursorCode: string;
  indicationPrecursorText: string;
  indicationTextCode: string;
  indicationText: string;
  indicationValueUnitofMeasureCode: string;
  indicationValueUnitofMeasureText: string;
  durationNumericValue: number;
  durationTextCode: string;
  durationText: string;
  descriptor: string;
  dose: number;
  conversionTotal: number;
  calculate: boolean;
}

export interface IPrescriptionScript {
  prescriptionId?: number;
  drugFormat: string;
}

export interface IPrescriptionAlert {
  prescriptionId?: number;
  alertId?: number;
  alertTypeId: number;
  overrideId: number;
  comment: string;
  userId: number;
  userName: string;
  createdAt: string | Date;
}

export interface IPrescriptionComment {
  commentId?: number;
  patientId: number;
  ROUTED_MED_ID: number;
  encounterId?: number;
  prescriptionId?: number;
  expirationDate: string | Date;
  type: number;
  archive: string | number;
  userId: number;
  userName: string;
  doctorId: number;
  doctorName: string;
  comment: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  CommentCriteria: IPrescriptionCommentCriteria;
  noExpDate?: boolean;
}

export interface IPrescriptionCommentCriteria {
  commentId?: number;
  sequenceNumber: number;
  HIC_SEQN: number;
  ETC_ID: number;
  ROUTED_MED: number;
  type?: number;
  name?: string;
}

export interface IPrescriptionDiagnosis {
  diagnosisId?: number;
  prescriptionId?: number;
  icdId: string;
  encounterId: number;
  name: string;
}

export interface IPrescriptionDelete {
  prescriptionId: number;
  sequenceNumber: number;
  encounterId: string;
  messageId: string;
  patientId: number;
  writtenDate: string | Date;
  practiceId: number;
  userId: number;
  userName: number;
  doctorId: number;
  doctorName: string;
  refill: number;
  prescriptionType: number;
  drugDuration: string | Date;
  fillDate: string | Date;
  sendMethod: number;
  pharmacyId: number;
  pharmacy: string;
  useSubstitution: boolean;
  drugNameTitle: string;
  drugFormat: string;
  pharmacyNote: string;
  sampleLotNumber: string;
  sampleExpiration: string | Date;
  deleteComment: string;
  createdAt: string | Date;
}

export interface IReconcileRecord {
  keyname?: string;
  drugId: number;
  prescriptionId: number;
  name: string;
  writtenDate: string | Date;
  drugDuration: string | Date;
  doctorName: string;
  drugType: EListTypeEnum;
  isDownloadedMed: boolean;
  isReconciled?: boolean;
  action?: number;
  prescriptionDrug: IPrescriptionDrug;
  comment: string;
  chronic: boolean;
}

export interface IPrescriptionStatus {
  prescriptionStatusId?: number;
  prescriptionId?: number;
  messageId?: string;
  prescriptionStatusTypeId: number;
  name: string;
  encounterId: number | undefined;
  userId: number | undefined;
  userName: string;
  createdAt?: string | Date;
  PrescriptionStatusType?: IPrescriptionStatusType;
}

export interface IPrescriptionStatusType {
  prescriptionStatusTypeId: number;
  delivered?: number;
  name: string;
  archive: boolean;
  userId: number;
  PrescriptionStatusAction: IPrescriptionStatusAction[];
  PrescriptionStatusPractice: IPrescriptionStatusPractice[];
}

export interface IPrescriptionStatusPractice {
  prescriptionStatusTypeId: number;
  practiceId: number;
}

export interface IPrescriptionStatusAction {
  prescriptionStatusTypeId: number;
  parameterId: number;
  prescriptionstatusaction: number;
  PrescriptionStatusParameter?: IPrescriptionStatusParameter[];
  PrescriptionStatusType: IPrescriptionStatusType;
}

export interface IPrescriptionStatusParameter {
  parameterId?: number;
  parameterType: number;
  value: string;
}

export enum EListTypeEnum {
  CURRENTMEDS = 1,
  EXPIREDMEDS = 2,
}
