import { makeAutoObservable, observable } from 'mobx';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import {
  IAuditLog,
  IAuditLogType,
  IAuditLogFilter,
  createAuditLog,
  deleteAuditTableHash,
  checkAuditLog,
  getAuditLogTypes,
  searchAuditLog,
  deleteAuditLog,
  IAuditLogData,
} from 'shared/api/auditlog';

class AuditLogModel {
  public auditLogTypes: IAuditLogType[] = [];

  public auditLog: IAuditLogData[] = [];

  public status: Record<'createAuditLog' | 'deleteAuditTableHash' | 'checkAuditLog' | 'getAuditLogTypes' | 'searchAuditLog' | 'deleteAuditLog', ActionStatus> =
    {
      createAuditLog: OActionStatus.Initial,
      deleteAuditTableHash: OActionStatus.Initial,
      checkAuditLog: OActionStatus.Initial,
      getAuditLogTypes: OActionStatus.Initial,
      searchAuditLog: OActionStatus.Initial,
      deleteAuditLog: OActionStatus.Initial,
    };

  public errors: Record<
    'createAuditLog' | 'deleteAuditTableHash' | 'checkAuditLog' | 'getAuditLogTypes' | 'searchAuditLog' | 'deleteAuditLog',
    Nullable<string>
  > = {
    createAuditLog: null,
    deleteAuditTableHash: null,
    checkAuditLog: null,
    getAuditLogTypes: null,
    searchAuditLog: null,
    deleteAuditLog: null,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  *createAuditLog(payload: IAuditLog) {
    this.status.createAuditLog = OActionStatus.Pending;
    this.errors.createAuditLog = null;
    let response: Nullable<IAuditLog> | undefined;
    try {
      const output: AjaxResponse<IAuditLog> = yield lastValueFrom(createAuditLog(payload).pipe(startWith(null)));
      this.status.createAuditLog = OActionStatus.Fulfilled;
      response = output.response;
    } catch (error: unknown) {
      this.status.createAuditLog = OActionStatus.Rejected;
      this.errors.createAuditLog = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  *deleteAuditTableHash(practiceId: number) {
    this.status.deleteAuditTableHash = OActionStatus.Pending;
    this.errors.deleteAuditTableHash = null;
    let response: IAuditLogType[] = [];
    try {
      const output: AjaxResponse<IAuditLogType[]> = yield lastValueFrom(deleteAuditTableHash(practiceId).pipe(startWith([])));
      this.status.deleteAuditTableHash = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.deleteAuditTableHash = OActionStatus.Rejected;
      this.errors.deleteAuditTableHash = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  *checkAuditLog(practiceId: number) {
    this.status.checkAuditLog = OActionStatus.Pending;
    this.errors.checkAuditLog = null;
    let response: any | undefined;
    try {
      const output: AjaxResponse<any> = yield lastValueFrom(checkAuditLog(practiceId).pipe(startWith(undefined)));
      this.status.checkAuditLog = OActionStatus.Fulfilled;
      response = output.response;
    } catch (error: unknown) {
      this.status.checkAuditLog = OActionStatus.Rejected;
      this.errors.checkAuditLog = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  *getAuditLogTypes() {
    this.status.getAuditLogTypes = OActionStatus.Pending;
    this.errors.getAuditLogTypes = null;
    let response: IAuditLogType[] = [];
    try {
      const output: AjaxResponse<IAuditLogType[]> = yield lastValueFrom(getAuditLogTypes().pipe(startWith([])));
      this.status.getAuditLogTypes = OActionStatus.Fulfilled;
      this.auditLogTypes = output.response ?? [];
      response = output.response ?? [];
    } catch (error: unknown) {
      this.auditLogTypes = [];
      this.status.getAuditLogTypes = OActionStatus.Rejected;
      this.errors.getAuditLogTypes = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  *searchAuditLog(payload: IAuditLogFilter) {
    this.status.searchAuditLog = OActionStatus.Pending;
    this.errors.searchAuditLog = null;
    let response: IAuditLogData[] = [];
    try {
      const output: AjaxResponse<IAuditLogData[]> = yield lastValueFrom(searchAuditLog(payload).pipe(startWith([])));
      this.status.searchAuditLog = OActionStatus.Fulfilled;
      this.auditLog = output.response ?? [];
      response = output.response ?? [];
    } catch (error: unknown) {
      this.auditLog = [];
      this.status.searchAuditLog = OActionStatus.Rejected;
      this.errors.searchAuditLog = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  *deleteAuditLog(practiceId: number) {
    this.status.deleteAuditLog = OActionStatus.Pending;
    this.errors.deleteAuditLog = null;
    let response: any | undefined;
    try {
      const output: AjaxResponse<any> = yield lastValueFrom(deleteAuditLog(practiceId).pipe(startWith(undefined)));
      this.status.deleteAuditLog = OActionStatus.Fulfilled;
      response = output.response;
    } catch (error: unknown) {
      this.status.deleteAuditLog = OActionStatus.Rejected;
      this.errors.deleteAuditLog = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }
}

const auditLogModel = new AuditLogModel();
export default auditLogModel;
