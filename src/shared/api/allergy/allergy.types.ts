export interface IAllergy {
  id: string | number;
  patientId: string | number;
  name: string;
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
  updatedAt?: Date | string;
  onsetDate?: Date | string;
  endDate?: Date | string;
  archive?: string | number;
  userId?: string | number;
  userName?: string;
  doctorId?: string | number;
  doctorName?: string;
}

export interface IAllergyUpdatePayload {
  id: string | number;
  patientId?: string | number;
  name: string;
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
  onsetDate?: Date | string;
  endDate?: Date | string;
  archive?: string | number;
  archivedName?: string;
  userId?: string | number;
  userName?: string;
  doctorId?: string | number;
  doctorName?: string;
}

/**
 * The IInteractionAllergy interface is for grouping the response of interactions and allergies
 * at the same time.
 */
export interface IInteractionAllergy {
  interactions?: IInteractionDrugcheck[];
  allergies?: IAllergyDrugcheck[];
}

export interface IInteractionDrugcheck {
  DDI_DES: string;
  DDI_SL: number | string;
  ROUTED_MED_ID: number;
}

export interface IAllergyDrugcheck {
  allergy: number;
  detail: {
    HIC_DESC?: string;
    HIC_ROOT?: number;
    ROUTED_MED_ID?: number;
    DAM_AGCCSD?: string;
    DAM_AGCSPD?: string;
    DAM_ALRGN_GRP?: number;
    DAM_ALRGN_XSENSE?: number;
    HIC?: string;
    HIC_SEQN?: number;
    chemicalDescription?: string;
    medicationDescription?: string;
  };
  title: string;
}

export interface IAllergyCreatePayload {
  patientId: string | number;
  name: string;
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
  onsetDate?: Date | string;
  endDate?: Date | string;
  archive?: string | number;
  archivedName?: string;
  userId?: string | number;
  userName?: string;
  doctorId?: string | number;
  doctorName?: string;
  allergyId?: string | number;
  ROUTED_MED_ID?: string | number;
}

export interface IAllergyClassification {
  allergyType?: string | number;
  allergyId?: string | number;
  ROUTED_MED_ID?: string | number;
  Descr?: string;
}

export interface IAllergySearchPayload {
  query: { name: Nullable<string> };
}
