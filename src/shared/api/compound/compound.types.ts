import type { IPractice } from 'shared/api/practice';

export interface ICompoundObject {
  compoundId: number;
  name: string;
  comment: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  organizationId: number | null;
  CompoundPractices: ICompoundPractice[];
  CompoundUsers: ICompoundUser[];
  Compounds: ICompound[];
}

/**
 * Structure for the format for both the delivered and custom
 * formats. IFormat is also used for situations where the medication
 * is re-prescribed from history. So there is some overlap and
 * repetition to the structure. FOr instance the GCN_SEQNO is in
 * the main level 0 of the object but also at the PrescriptionDrugs level
 */
export interface ICompound {
  compoundId: number;
  refill?: number;
  duration?: number;
  durationQualifier?: string;
  maxDaily?: number;
  pharmacyId?: string;
  pharmacy?: string;
  combinationMed?: number;
  printDuration?: number;
  concurrentMed?: number;
  prescriptionType?: number;
  delivered?: number;
  orderTitle?: Nullable<string>;
  pharmacyNote?: Nullable<string>;
  internalComment?: Nullable<string>;
  authorizationQualifier?: string;
  authorizationId?: string;
  CompoundDrugs?: ICompoundDrug[];
  CompoundSigs?: ICompoundSig[];
  CompoundStatuses?: Array<{
    compoundId?: number;
    prescriptionStatusTypeId?: number;
    name?: string;
  }>;
  CompoundDrugDiagnoses?: Array<{
    compoundId?: number;
    diagnosisId?: number;
    icdId?: string;
    name?: string;
  }>;
  CompoundHeader?: ICompoundHeader;
  compoundQuantity: number;
  compoundQuantityQualifier: string;
  QuantityQualifier: { potencyUnit: string; name: string };
}

/**
 * Compound type
 */
export interface ICompoundHeader {
  compoundId: number;
  name: string;
  comment: string;
  CompoundPractices: ICompoundPractice[];
  CompoundUsers: ICompoundUser[];
  Compound: ICompound;
}

/**
 * Compound Practice type
 */
export interface ICompoundPractice {
  compoundId: number;
  practiceId: number;
  Practice?: IPractice;
}

/**
 * Compound User type
 */
export interface ICompoundUser {
  compoundId: number;
  userId: number;
}

/**
 * Compound sig type
 */
export interface ICompoundSig {
  drugId?: number;
  sigId?: number;
  sigOrder?: number;
  sigCompound?: number;
  line3?: string;
  sigFreeText?: string;
  multipleSigModifier?: Nullable<string>;
  doseDeliveryMethodCode?: string;
  doseDeliveryMethodText?: string;
  doseFormCode?: string;
  doseFormText?: string;
  doseQuantity: number;
  durationNumericValue: any;
  durationText: any;
  durationTextCode: any;
  routeofAdministrationCode?: string;
  routeofAdministrationText?: string;
  siteofAdministrationCode?: Nullable<string>;
  siteofAdministrationText?: Nullable<string>;
  administrationTimingCode?: string;
  administrationTimingText?: Nullable<string>;
  secondaryAdministrationTimingCode?: Nullable<string>;
  secondaryAdministrationTimingText?: Nullable<string>;
  secondaryAdministrationTimingModifierCode?: Nullable<string>;
  secondaryAdministrationTimingModifierText?: Nullable<string>;
  frequencyNumericValue?: number;
  frequencyUnitsCode?: Nullable<string>;
  frequencyUnitsText?: Nullable<string>;
  intervalNumericValue?: number;
  intervalUnitsText?: string;
  intervalUnitsCode?: string;
  indicationPrecursorCode?: string;
  indicationPrecursorText?: string;
  indicationTextCode?: string;
  indicationText?: string;
  indicationValueUnitofMeasureCode?: string;
  indicationValueUnitofMeasureText?: string;
  dose?: number;
  conversionTotal?: number;
  calculate?: boolean;
  descriptor?: any;
}

/**
 * Compound drug type
 */
export interface ICompoundDrug {
  compoundId: number;
  drugId: number;
  drugOrder: number;
  ndc: Nullable<string>;
  rxnorm: Nullable<string>;
  rxnormQualifier: Nullable<string>;
  ROUTED_MED_ID: Nullable<number>;
  GCN_SEQNO: Nullable<number>;
  MED_NAME_TYPE_CD: Nullable<number>;
  MED_REF_DEA_CD: Nullable<string>;
  MED_REF_FED_LEGEND_IND: Nullable<string>;
  MED_REF_GEN_DRUG_NAME_CD: Nullable<string>;
  drugName: string;
  quantity: number;
  quantityQualifier: string;
  potencyUnit?: string;
  maxDaily: Nullable<number>;
  calculate: number | boolean;
  sampleLotNumber?: Nullable<string>;
  sampleExpiration?: string;
  useSubstitution?: boolean;
  line1: Nullable<string>;
  line2: Nullable<string>;
  DrugOpioid?: { ROUTED_MED_ID: number };
  QuantityQualifier: { potencyUnit: string; name: string };
  CompoundSigs?: ICompoundSig[];
}
