import moment from 'moment';

export enum TotalsEnum {
  BOTH = 0,
  HISTORY = 1,
  PENDING = 2,
  FILTER = 3,
}

export interface IMessage {
  drugName: string;
  messageStatus: string;
  messageId: string;
  patientId: number;
  taskId?: number;
  TaskAttachment?: any;
  requestId: number;
  messageType: string;
  messageResponse: string | null;
  messageDate: Date;
  note?: string | null;
  quantity: string;
  messageRequestCode: 'T' | 'G' | 'OS' | 'U' | 'S' | 'D' | 'P';
  followUpRequest: string;
  lastName: string;
  firstName: string;
  dob: Date;
  requireApproval: number;
  doctorId: number;
  doctorFirstName: string;
  doctorLastName: string;
  userId: number;
  userName: string;
  practiceId: number;
  reviewedUserId: number | null;
  reviewedUserName: string | null;
  reviewedDate: string;
  updatedAt: string;
  pharmacy: string;
}

export interface IQuery {
  doctorId: number[];
  practiceId: number | number[];
  fromDate: Date;
  toDate: Date;
  messageStatus?: string[];
  messageStatusForCount?: string[];
  messageType: string[] | string;
  taskStatus?: string[];
  taskType?: string[] | string;
  firstName: string;
  lastName: string;
  offset: number;
  limit: number;
  isPagingHidden: boolean;
  offsetTask: number;
  isPagingHiddenTask: boolean;
  sortedBy: OSortedByType;
  totals?: TotalsEnum;
}

export interface IFilter {
  doctorId?: number[];
  practiceId?: number[] | number;
  fromDate: Date;
  toDate: Date;
  messageStatus?: string[];
  messageStatusForCount?: string[];
  messageType: string[] | string;
  taskStatus?: string[];
  taskType?: string[] | string;
  firstName: string;
  lastName: string;
  sortedBy: OSortedByType;
  totals?: TotalsEnum;
}
export interface ISettings {
  offset: number;
  limit: number;
  isPagingHidden: boolean;
  offsetTask: number;
  isPagingHiddenTask: boolean;
}

export enum ONameModals {
  Practice = 'practice',
  Prescriber = 'prescriber',
  User = 'user',
}

export type ONameModalsType = typeof ONameModals[keyof typeof ONameModals];

export enum OSortedBy {
  DrugName = 'drugName',
  FirstName = 'firstName',
  LastName = 'lastName',
  MessageDate = 'messageDate',
}

export type OSortedByType = typeof OSortedBy[keyof typeof OSortedBy];

export enum OTabList {
  Pending = 'pending',
  RefillRequest = 'refillRequest',
  ChangeRequest = 'changeRequest',
  NewPrescription = 'newPrescription',
  ErrorReviewed = 'errorReviewed',
  History = 'history',
  Approved = 'approved',
  Declined = 'declined',
  Cancel = 'cancel',
  Error = 'error',
  SearchResult = 'searchResult',
  InHousePharmacy = 'inHousePharmacy',
}

export type OTabListType = typeof OTabList[keyof typeof OTabList];

export interface ICount {
  messageStatus: string;
  messageType: string;
  messageDate: Date;
  total: number;
}

export interface IMessageApprove {
  prescription?: any;
  header?: any;
  ssPriorAuthorization?: string;
  ssPrescriberAuthorization?: string;
  ssRefill?: number;
  practiceId?: number;
  isOldScript?: boolean;
  doctorId?: number;
  human?: string;
  veterinarian?: string;
  comment?: string;
  duration?: number;
  messageDate?: Date;
  messageId: string;
  drugcode?: string;
  priorAuthorization?: string;
  messageRequestData?: string;
  messageStatus?: string;
  messageType: string;
  patientId?: number;
  refill?: number;
  requestId: number;
  relatesToMessageId?: string;
  messageXml?: any;
  ncpdpId?: string;
  alternatives?: any[];
  approved?: string;
  dob?: Date;
  messageHistory?: any[];
  messageRequestedSelected?: {
    DrugDescription?: string;
    DrugCoded?: {
      ProductCode: any;
      ProductCodeQualifier: string;
      DrugDBCode: string;
      DrugDBCodeQualifier: string;
      DEASchedule: string;
    };
    Quantity?: {
      Value: number;
      CodeListQualifier: string;
      UnitSourceCode: string;
      PotencyUnitCode: string;
    };
    Directions?: string;
    NumberOfRefills?: number;
    Substitutions?: number;
    Note?: string;
    WrittenDate?: {
      Date: string;
    };
    EffectiveDate?: {
      Date: string;
    };
    DrugCoverageStatusCode?: string;
  };
}

export interface ICancelPrescriptionPayload {
  body: string;
  header: {
    sentTime: moment.Moment;
    relatesToMessageId: string;
  };
  patient: {
    patientId: number;
  };
  response: {
    responseCode: string;
  };
}
