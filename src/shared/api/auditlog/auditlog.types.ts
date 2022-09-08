import type { IUser } from 'shared/api/user';

export interface IAuditLogFilter<N = number, D = Date> {
  lastAuditLogId?: N;
  auditLogTypeId?: N;
  patientId?: N;
  users?: IUser[];
  practiceId?: N;
  startDate?: D;
  endDate?: D;
  offset?: N;
}

export interface IAuditLog {
  auditLogId: number;
  auditLogTypeId: number;
  userId: number;
  patientId: number;
  practiceId: number;
  tableName: string;
  description: string;
  params: string;
  createdAt: Date;
  hash: string;
}

export interface IAuditLogType {
  auditLogTypeId: number;
  description: string;
}

export interface IAuditLogData {
  action?: string;
  auditLogId?: number;
  createdAt?: string;
  description?: string;
  patientFirstName?: string;
  patientLastName?: string;
  timezone?: string;
  userFirstName?: string;
  userLastName?: string;
  validity?: number;
}
