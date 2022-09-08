import { makeAutoObservable, observable } from 'mobx';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import {
  IProvider,
  IPhysicianMeasure,
  IPhysicianPayload,
  getProviders,
  getPhysicians,
  exportEPMeasure,
  getHospitals,
  IAuditLogUsers,
  getDocumentTypes,
  IDocumentTypes,
  getDocuments,
  IDocumentsPayload,
} from 'shared/api/report/';
import { requestAccess } from 'shared/api/user/user.resources';

class ReportsStore {
  public providersList: IProvider[] = [];

  public physiciansList: IPhysicianMeasure[] = [];

  public hospitalsList: IPhysicianMeasure[] = [];

  public physiciansExportList: any;

  public auditLogUsers: IAuditLogUsers[] = [];

  public documentTypes: IDocumentTypes[] = [];

  public documents: any[] = [];

  public status: Record<'search', ActionStatus> = {
    search: OActionStatus.Initial,
  };

  public errors: Record<'search', Nullable<string>> = {
    search: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        providersList: observable.shallow,
        physiciansList: observable.shallow,
        hospitalsList: observable.shallow,
        auditLogUsers: observable.shallow,
        documentTypes: observable.shallow,
        documents: observable.shallow,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );
  }

  *getAllProviders() {
    this.providersList = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getProviders().pipe(startWith([])));
      this.status.search = OActionStatus.Fulfilled;
      this.providersList = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getAllPhysicians(payload: IPhysicianPayload) {
    this.physiciansList = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getPhysicians(payload).pipe(startWith({})));
      this.status.search = OActionStatus.Fulfilled;
      this.physiciansList = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getAllHospital(payload: IPhysicianPayload) {
    this.physiciansList = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getHospitals(payload).pipe(startWith({})));
      this.status.search = OActionStatus.Fulfilled;
      this.hospitalsList = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *exportPhysicians(variant: string, exportEPData: IPhysicianPayload) {
    this.physiciansExportList = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(exportEPMeasure(variant, exportEPData).pipe(startWith({})));
      this.status.search = OActionStatus.Fulfilled;
      this.physiciansExportList = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getAllAuditUsers(organizationID?: number) {
    this.auditLogUsers = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(requestAccess(organizationID).pipe(startWith([])));
      this.status.search = OActionStatus.Fulfilled;
      this.auditLogUsers = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getAllDocumentTypes() {
    this.documentTypes = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getDocumentTypes().pipe(startWith([])));
      this.status.search = OActionStatus.Fulfilled;
      this.documentTypes = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getAllDocuments(payload: IDocumentsPayload) {
    this.documents = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getDocuments(payload).pipe(startWith([])));
      this.status.search = OActionStatus.Fulfilled;
      this.documents = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }
}
const reportsStore = new ReportsStore();
export default reportsStore;
