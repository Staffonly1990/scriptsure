/**
 * Orderset type
 */
export interface IOrderset {
  ordersetId: number;
  name: string;
  comment: string;
  OrdersetSequences: IOrdersetSequence[];
  OrdersetPractices: IOrdersetPractice[];
  OrdersetUsers: IOrdersetUser[];
  createdAt: string | Date;
  organizationId: number;
  updatedAt: string | Date;
}

/**
 * Reorder the Orderset sequence
 */
export interface IOrdersetSequenceReorder {
  ordersetId: number;
  orderId: number;
  change: number;
}

/**
 * Education type
 */
export interface IOrdersetSequence {
  ordersetId?: number;
  orderId?: number;
  sequenceId?: number;
  ordersetType: number;
  description: string;
  name: string;
  detail?: string;
  Orders?: IOrder[];
  OrderEducations?: IOrderEducation[];
  OrderDiagnoses?: IOrderDiagnosis[];
}

/**
 * Education type
 */
export interface IOrderEducation {
  orderId: number;
  conceptId: string;
  codingSystem: number;
  languageId: string;
  name: string;
}

/**
 * Diagnosis type
 */
export interface IOrderDiagnosis {
  orderId?: number;
  conceptId: string;
  codingSystem: number;
  associatedConceptId?: string;
  associatedCodingSystem?: string;
  snomed: string;
  name: string;
  isCondition?: boolean;
  startDate?: Date | string; // date
  endDate?: Date | string; // date
  chronicId?: number;
  problemTypeId?: number;
  terminal?: number;
  terminalStageId?: number;
  diagnosisTypeId?: number;
  finalConceptId?: string;
  finalCodingSystem?: string;
  comment?: string;
}

/**
 * Orderset Practice type
 */
export interface IOrdersetPractice {
  ordersetId: number;
  practiceId: number;
}

/**
 * Orderset User type
 */
export interface IOrdersetUser {
  ordersetId: number;
  userId: number;
}

/**
 * Structure for the format for both the delivered and custom
 * formats. IFormat is also used for situations where the medication
 * is re-prescribed from history. So there is some overlap and
 * repetition to the structure. FOr instance the GCN_SEQNO is in
 * the main level 0 of the object but also at the PrescriptionDrugs level
 */
export interface IOrder {
  orderId?: number;
  refill?: number;
  duration?: number;
  durationQualifier?: string;
  maxDaily?: number;
  pharmacyId?: string;
  pharmacy?: string;
  combinationMed?: number;
  compoundId?: any;
  compoundQuantity?: any;
  compoundQuantityQualifier?: any;
  compoundTitle?: any;
  printDuration?: number;
  concurrentMed?: number;
  prescriptionType?: number;
  delivered?: number;
  orderTitle?: string;
  pharmacyNote?: string;
  internalComment?: string;
  authorizationQualifier?: string;
  authorizationId?: string;
  OrderDrugDiagnoses?: [
    {
      orderId?: number;
      diagnosisId?: number;
      icdId?: string;
      name?: string;
    }
  ];
  OrderDrugs?: [
    {
      orderId: number;
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
      line1: string;
      line2: string;
      DrugOpioid: { ROUTED_MED_ID: number };
      OrderSigs: [
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
  OrderCompoundSigs: [
    {
      orderId?: number;
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
  OrderStatuses?: [
    {
      orderId?: number;
      prescriptionStatusTypeId?: number;
      name?: string;
    }
  ];
}
