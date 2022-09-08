export enum AccessRequestStatusEnum {
  ACTIVE = 0,
  REQUESTED = 1,
  APPROVED = 2,
  DENIED = 3,
}

export interface IAccessRequest {
  prescriberID?: number;
  userID?: number;
  accessStatus?: AccessRequestStatusEnum;
}
