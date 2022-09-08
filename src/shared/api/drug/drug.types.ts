import { IPrescriptionSig } from '../prescription';

export interface IFormat {
  PrescriptionDiagnoses?: [
    {
      prescriptionId?: number;
      diagnosisId?: number;
      icdId?: string;
      encounterId?: number;
      name?: string;
    }
  ];
  PrescriptionDrugs?: [
    {
      formatId: number;
      prescriptionId?: number;
      drugId: number;
      drugOrder: number;
      ndc: string;
      rxnorm: string;
      rxnormQualifier: string;
      ROUTED_MED_ID: number;
      GCN_SEQNO: number;
      MED_REF_DEA_CD: string;
      drugName: string;
      quantity: number;
      quantityQualifier: string;
      potencyUnit: string;
      maxDaily: number;
      calculate: number;
      sampleLotNumber?: string;
      sampleExpiration?: string;
      useSubstitution: boolean;
      drugDuration?: Date;
      drugDurationPadded?: Date;
      line1: string;
      line2: string;
      reconcileDate?: Date;
      reconcileStatus?: string;
      reconcileUserId?: number;
      chronic?: boolean;
      DrugOpioid: { ROUTED_MED_ID: number };
      PrescriptionSigs: [
        {
          drugId?: number;
          sigId?: number;
          sigOrder?: number;
          line3?: string;
          sigFreeText?: string;
          multipleSigModifier?: string;
          doseDeliveryMethodCode?: string;
          doseDeliveryMethodText?: string;
          doseQuantity?: number;
          doseFormCode?: string;
          doseFormText?: string;
          routeofAdministrationCode?: string;
          routeofAdministrationText?: string;
          siteofAdministrationCode?: string;
          siteofAdministrationText?: string;
          administrationTimingCode?: string;
          administrationTimingText?: string;
          secondaryAdministrationTimingCode?: string;
          secondaryAdministrationTimingText?: string;
          secondaryAdministrationTimingModifierCode?: string;
          secondaryAdministrationTimingModifierText?: string;
          frequencyNumericValue?: number;
          frequencyUnitsCode?: string;
          frequencyUnitsText?: string;
          intervalNumericValue?: number;
          intervalUnitsText?: string;
          intervalUnitsCode?: string;
          indicationPrecursorCode?: string;
          indicationPrecursorText?: string;
          indicationTextCode?: string;
          indicationText?: string;
          indicationValueUnitofMeasureCode?: string;
          indicationValueUnitofMeasureText?: string;
          durationNumericValue?: number;
          durationTextCode?: string;
          durationText?: string;
          dose?: number;
          conversionTotal?: number;
          calculate?: boolean;
        }
      ];
    }
  ];
  PrescriptionScript?: {
    formatId?: number;
    prescriptionId?: number;
    drugFormat?: string;
  };
  PrescriptionStatuses?: [
    {
      prescriptionId?: number;
      prescriptionStatusId: number;
      prescriptionStatusTypeId?: number;
      name?: string;
      encounterId?: number;
      userId?: number;
      userName?: string;
    }
  ];
  PrescriptionCompoundSigs: IPrescriptionCompoundSig[];
  messageId?: string;
  prescriptionId?: number;
  descriptor?: string;
  dose?: string;
  drugId?: number;
  frequencyNumericValue?: number;
  frequencyUnitsCode?: string;
  line3?: string;
  doseQuantity?: number;
  sigId?: number;
  sigOrder?: number;
  doseFormCode?: string;
  ROUTED_MED_ID?: number;
  GCN_SEQNO?: number;
  MED_REF_DEA_CD?: string;
  calculate?: boolean;
  drugName?: string;
  drugOrder?: number;
  formatId?: number;
  line1?: string;
  line2?: string;
  ndc?: string;
  potencyUnit?: string;
  quantity?: number;
  quantityQualifier?: string;
  rxnorm?: string;
  rxnormQualifier?: string;
  sampleLotNumber?: string;
  useSubstitution?: boolean;
  archive?: boolean;
  authorizationId?: string;
  authorizationQualifier?: string;
  combinationMed?: boolean;
  concurrentMed?: number;
  createdAt?: Date;
  delivered?: number;
  doctorId?: number;
  doctorName?: string;
  duration?: number;
  drugDuration?: Date;
  drugDurationPadded?: Date;
  expires?: string;
  durationQualifier?: string;
  internalComment?: string;
  pharmacy?: string;
  pharmacyId?: string;
  pharmacyNote?: string;
  practiceId?: number;
  prescriptionType?: number;
  prescriptionStatusTypeId?: number;
  printDuration?: number;
  refill?: number;
  updatedAt?: Date;
  fillDate?: Date;
  writtenDate?: Date;
  FormularyStatus?: string;
  sigLine?: string;
  freeform?: string;
  patientId?: number;
  encounterId?: number;
  groupId?: number;
  sendMethod?: number;
  formularyChecked?: boolean;
  maxDaily?: number;
  sigs?: ISig[];
  copay?: string;
  long?: string;
  messageStatus?: string;
  authorizationStatus?: string;
  compoundTitle?: string;
  compoundQuantity?: number;
  compoundQuantityQualifier?: string;
  predictionId?: string;
  PrescriptionConfirmation?: IPrescriptionConfirmation;
}

export interface IPrescriptionCompoundSig {
  prescriptionId?: number;
  sigId?: number;
  sigOrder?: number;
  line3?: string;
  sigFreeText?: string;
  multipleSigModifier?: string;
  doseDeliveryMethodCode?: string;
  doseDeliveryMethodText?: string;
  doseQuantity?: number;
  doseFormCode?: string;
  doseFormText?: string;
  routeofAdministrationCode?: string;
  routeofAdministrationText?: string;
  siteofAdministrationCode?: string;
  siteofAdministrationText?: string;
  administrationTimingCode?: string;
  administrationTimingText?: string;
  secondaryAdministrationTimingCode?: string;
  secondaryAdministrationTimingText?: string;
  secondaryAdministrationTimingModifierCode?: string;
  secondaryAdministrationTimingModifierText?: string;
  frequencyNumericValue?: number;
  frequencyUnitsCode?: string;
  frequencyUnitsText?: string;
  intervalNumericValue?: number;
  intervalUnitsText?: string;
  intervalUnitsCode?: string;
  indicationPrecursorCode?: string;
  indicationPrecursorText?: string;
  indicationTextCode?: string;
  indicationText?: string;
  indicationValueUnitofMeasureCode?: string;
  indicationValueUnitofMeasureText?: string;
  durationNumericValue?: number;
  durationTextCode?: string;
  durationText?: string;
  dose?: number;
  conversionTotal?: number;
  calculate?: boolean;
}

export interface IPrescriptionConfirmation {
  messageId?: string;
  userId?: number;
  practiceId?: number;
  patientId?: number;
  pharmacyId?: string;
  predictionId?: string;
  retries?: number;
}

export interface ISig {
  FormularyStatus: string;
  ROUTED_MED_ID: number;
  GCN_SEQNO: number;
  delivered: number;
  drugId: number;
  drugName: string;
  formatId: number;
  line1: string;
  ndc: string;
  sigLine: string;
  coupon?: {
    CouponNdc?: any[];
    couponId: number;
    description: string;
    id: number;
    offerId: number;
  };
}

export interface ICurrentMedication {
  GCN_SEQNO?: number;
  MED_NAME_TYPE_CD?: number;
  MED_REF_DEA_CD?: string;
  MED_REF_FED_LEGEND_IND?: string;
  MED_REF_GEN_DRUG_NAME_CD?: string;
  Ndc?: string;
  Prescription?: {
    PrescriptionCompoundSigs: IPrescriptionCompoundSig[];
    PrescriptionScript: { drugFormat: string };
    PrescriptionStatusAction: {
      PrescriptionStatusParameter: {
        parameterId: number;
        parameterType: number;
        value: string;
      }[];
      parameterId: number;
      prescriptionStatusTypeId: number;
    };
    approveDate: string | Date;
    approveName: string;
    archive: boolean;
    authorizationStatus?: string;
    combinationMed?: boolean;
    compoundDrugDuration: string | Date;
    compoundQuantity?: number;
    compoundQuantityQualifier?: string;
    compoundTitle?: string;
    doctorId?: number;
    doctorName?: string;
    fillDate?: string | Date;
    followUpPrescriberName: string;
    messageId?: string;
    messageStatus?: string;
    messageType: string;
    patientId: number;
    pharmacy: string;
    practiceId: number;
    prescriptionId: number;
    prescriptionStatusTypeId: number;
    refill: number;
    sendMethod: number;
    supervisorId: number;
    supervisorName: string;
    userId: number;
    userName: number;
    writtenDate: string | Date;
  };
  PrescriptionSigs?: IPrescriptionSig[];
  ROUTED_MED_ID: number;
  RxNorm?: string;
  drugDuration?: string;
  drugDurationPadded?: Date;
  drugId?: number;
  drugName?: string;
  epn?: string;
  line1?: string;
  prescriptionId?: number;
  quantity?: number;
  quantityQualifier?: string;
  reconcileStatus?: string;
  rxnormQualifier?: string;
}

export interface IFormatResponse {
  formats: IFormat[];
  pharmacology?: string;
}
