import { IAllergyDrugcheck, IInteractionDrugcheck } from '../allergy';

export interface IDrugDose {
  MED_MEDID_DESC: string;
  ROUTED_MED_ID: number;
  GCN_SEQNO: number;
  MED_REF_DEA_CD?: number | string;
  MED_REF_GEN_DRUG_NAME_CD?: number | string;
  MED_REF_FED_LEGEND_IND?: number | string;
  MED_NAME_TYPE_CD?: number | string;
  MED_ROUTED_MED_ID_DESC?: string;
  MED_STRENGTH?: number | string;
  MED_STRENGTH_UOM: string;
  MED_DOSAGE_FORM_DESC: string;
  ndc: string;
  rxNorm: string;
  rxNormQualifier: string;
  line1: string;
  FormularyStatus?: string;
  copay?: string;
  long?: string;
  epn?: any;
}

export interface IDrugABC {
  FontColorUser: Nullable<string>;
  FontNameUser: Nullable<string>;
  FontSizeUser: Nullable<string>;
  FontStyleUser: Nullable<string>;
  FormularyStatus: number | string;
  GCN_SEQNO: number | string;
  GenericName: string;
  MED_NAME_TYPE_CD: number | string;
  MED_ROUTED_MED_ID_DESC?: string;
  ROUTED_MED_ID: number;
  ReactionCode: string;
  ReasonAllergy: string;
  ReasonInteraction: string;
  TypeId: number | string;
  offerid: number | Nullable<string>;
  interaction?: IInteractionDrugcheck;
  allergy?: IAllergyDrugcheck;
}

export interface IFavoritesDrug {
  CoPayLong: string;
  CoPayShort: string;
  DrugGroupDescr: string;
  DrugType: string;
  FontColorUser?: Nullable<string>;
  FontNameUser: Nullable<string>;
  FontSizeUser: Nullable<string>;
  FontStyleUser: Nullable<string>;
  FormularyStatus: number | string;
  GCN_SEQNO: number | string;
  GenericName: string;
  MED_NAME_TYPE_CD: number | string;
  MED_ROUTED_MED_ID_DESC?: string;
  Pharmacology: Nullable<string>;
  ROUTED_MED_ID: number;
  ReactionCode: string;
  ReasonAllergy: string;
  ReasonInteraction: string;
  TypeId: number | string;
  multipletype: string | boolean | number; // boolean - 0 | 1, false | true, "False" | "True"
  offerid: number | Nullable<string>;
  interaction?: IInteractionDrugcheck;
  allergy?: IAllergyDrugcheck;
}

export interface ISearchDrug {
  DrugGroup?: string | null;
  FormularyStatus: number | string;
  GCN_SEQNO: number | string;
  GenericName: string;
  MED_NAME_ID: number;
  MED_NAME_TYPE_CD: number | string;
  MED_ROUTED_MED_ID_DESC?: string;
  MED_ROUTE_ID: number;
  MED_STATUS_CD: number | string;
  Pharmacology?: string | null;
  ROUTED_MED_ID: number;
  TypeId: number | string;
  multipletype: string | boolean | number; // boolean - 0 | 1, false | true, "False" | "True"
  offerid?: number | string | null;
  interaction?: IInteractionDrugcheck;
  allergy?: IAllergyDrugcheck;
}

/*
Converts the numeric value to a formulary description
@param formularyStatus
 public getFormularyDescription = (formularyStatus: string) => {
  switch (formularyStatus) {
      case '-1':
          return 'UNKNOWN';
      case '0':
          return 'NOT-REIMBURSABLE';
      case '1':
          return 'NON-FORMULARY';
      case '2':
          return 'ON FORMULARY (NOT PREFERRED)';
      case '3':
          return 'PREFERRED LEVEL 1';
      case '4':
          return 'PREFERRED LEVEL 2';
      case '5':
          return 'PREFERRED LEVEL 3';
      case '6':
          return 'PREFERRED LEVEL 4';
      case '7':
          return 'PREFERRED LEVEL 5';
      case '8':
          return 'PREFERRED LEVEL 6';
      case '9':
          return 'PREFERRED LEVEL 7';
      case '10':
          return 'PREFERRED LEVEL 8';
      default :
          return 'UNKNOWN';
  }
};

var drugGroups: IDrugGroup[] = [
      {drugGroup: '', name: 'Favorite'},
      {drugGroup: 'A', name: 'Antibiotics'},
      {drugGroup: 'B', name: 'Bronchodilator'},
      {drugGroup: 'C', name: 'Cardiac'},
      {drugGroup: 'D', name: 'Decongestant'},
      {drugGroup: 'E', name: 'Endocrine / GYN'},
      {drugGroup: 'G', name: 'GI'},
      {drugGroup: 'H', name: 'HTN / K+'},
      {drugGroup: 'O', name: 'Ophth / ENT'},
      {drugGroup: 'P', name: 'Pain'},
      {drugGroup: 'S', name: 'Salves / Derm'},
      {drugGroup: 'T', name: 'Psychotropic'},
      {drugGroup: 'Z', name: 'Misc'},
      {drugGroup: 'CO', name: 'Compound'},
      {drugGroup: 'OR', name: 'Order Set'},
  ];

*/
